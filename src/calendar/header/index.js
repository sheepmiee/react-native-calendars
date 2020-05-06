import React, {Component} from 'react';
import {ActivityIndicator} from 'react-native';
import {View, Text, TouchableOpacity, Image} from 'react-native';
import XDate from 'xdate';
import PropTypes from 'prop-types';
import styleConstructor from './style';
import {weekDayNames} from '../../dateutils';
import {
  CHANGE_MONTH_LEFT_ARROW,
  CHANGE_MONTH_RIGHT_ARROW
} from '../../testIDs';

class CalendarHeader extends Component {
  static propTypes = {
    theme: PropTypes.object,
    hideArrows: PropTypes.bool,
    month: PropTypes.instanceOf(XDate),
    addMonth: PropTypes.func,
    showIndicator: PropTypes.bool,
    firstDay: PropTypes.number,
    renderArrow: PropTypes.func,
    hideDayNames: PropTypes.bool,
    weekNumbers: PropTypes.bool,
    onPressArrowLeft: PropTypes.func,
    onPressArrowRight: PropTypes.func
  };

  static defaultProps = {
    monthFormat: 'MMMM yyyy',
  };

  constructor(props) {
    super(props);
    this.style = styleConstructor(props.theme);
    this.addMonth = this.addMonth.bind(this);
    this.substractMonth = this.substractMonth.bind(this);
    this.onPressLeft = this.onPressLeft.bind(this);
    this.onPressRight = this.onPressRight.bind(this);
  }

  addMonth() {
    this.props.addMonth(1);
  }

  substractMonth() {
    this.props.addMonth(-1);
  }

  shouldComponentUpdate(nextProps) {
    if (
      nextProps.month.toString('yyyy MM') !==
      this.props.month.toString('yyyy MM')
    ) {
      return true;
    }
    if (nextProps.showIndicator !== this.props.showIndicator) {
      return true;
    }
    if (nextProps.hideDayNames !== this.props.hideDayNames) {
      return true;
    }
    return false;
  }

  onPressLeft() {
    const {onPressArrowLeft} = this.props;
    if (typeof onPressArrowLeft === 'function') {
      return onPressArrowLeft(this.substractMonth);
    }
    return this.substractMonth();
  }

  onPressRight() {
    const {onPressArrowRight} = this.props;
    if (typeof onPressArrowRight === 'function') {
      return onPressArrowRight(this.addMonth);
    }
    return this.addMonth();
  }

  render() {
    let leftArrow = <View/>;
    let rightArrow = <View/>;
    let weekDaysNames = weekDayNames(this.props.firstDay);
    if (!this.props.hideArrows) {
      leftArrow = (
        <TouchableOpacity
          onPress={this.onPressLeft}
          style={this.style.arrow}
          hitSlop={{left: 20, right: 20, top: 20, bottom: 20}}
          testID={CHANGE_MONTH_LEFT_ARROW}
        >
          {this.props.renderArrow
            ? this.props.renderArrow('left')
            : <Image
              source={require('../img/previous.png')}
              style={this.style.arrowImage}
            />}
        </TouchableOpacity>
      );
      rightArrow = (
        <TouchableOpacity
          onPress={this.onPressRight}
          style={this.style.arrow}
          hitSlop={{left: 20, right: 20, top: 20, bottom: 20}}
          testID={CHANGE_MONTH_RIGHT_ARROW}
        >
          {this.props.renderArrow
            ? this.props.renderArrow('right')
            : <Image
              source={require('../img/next.png')}
              style={this.style.arrowImage}
            />}
        </TouchableOpacity>
      );
    }
    let indicator;
    if (this.props.showIndicator) {
      indicator = <ActivityIndicator/>;
    }

    const monthNum = this.props.month.getMonth() + 1
    const monthStr = monthNum < 10 ? '0' + monthNum : monthNum + ''
    const yaerStr = this.props.month.getFullYear();
    return (
      <View>
        <View style={[this.style.header, {padding: 0}]}>
          {leftArrow}
          <View style={{flexDirection: 'row', width: '100%', paddingVertical: 10, alignItems: 'flex-end'}}>
            <Text style={{fontSize: 30, fontWeight: 'bold', color: '#333', lineHeight: 30, marginBottom: -2}}>{monthStr}</Text>
            <Image
              style={{width: 15, height: 30, marginLeft: 1}}
              resizeMode="stretch"
              // source={{uri:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAABb0lEQVR4Xu3aPW+DMBSFYZt/20TdEB5DRizGlr9LxWCpQmp6HfxxzrVZksED7+NrJlvT+GMb7zcdoE9A4wL9CDQ+AP0jqO4IeO/v0zR9SydbFYD3/sMYs+37/nTOzRIENQAhPkRLEVQAnON/IXw6575eTQI9wF/xwzDcx3Hc/jsG1ABX4w8cWoAU8bQAqeIpAVLG0wGkjqcCyBFPA5ArngIgZzw8QO54aIAS8bAApeIhAUrGwwGUjocCqBEPA1ArHgKgZnx1gNrxVQEQ4qsBoMRXAUCKLw6AFl8UADG+GABqfBEA5PjsAOjxWQEY4rMBsMRnAWCKTw7AFp8UgDE+GQBrfBIA5vjLAOzxlwA0xL8NoCX+LQBN8dEA2uKjADTGiwG0xosANMeLAI5Fy7LM1trH8f94pJcQw3rkX/E9wYCgKV48AWEH13W9Sa6fIu/4+d3EE8AUFfOuHSBGS+PaPgEadzWmqU9AjJbGtc1PwA+TIvdBJBb6eAAAAABJRU5ErkJggg=='}}/>
              source={{uri: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAADqklEQVR4Xu3cW27bMBBGYWlDXUyBrEWPTR8NeCnpbrodW4GRBElTX3gZDn9yTl8ritR8B2rqBFkX/oSewBr66Xn4hQCCR0AABBB8AsEfnzcAAQSfQPDH5w1AAMEnEPzxeQMQQPAJBH983gAEEHwCwR+fNwABBJ9A8MfnDUAAwScQ/PF5A4gHcDwef55Opx/btj23OCoBtJiq0T0v+Ofz+c/ldvu+/24RAQEYYVnf5iv+x71bREAA1nIG97uG3yoCAjAAs7zFPfwWERCApV7lvVLwrSMggEo0q+U5+O9fFD5t2/ZSuz8B1E7QYH0v/MvRCcAAsOYWPfEJoEbOYG1vfAIwQCy9hQI+AZTqVa5TwSeASsiS5Ur4BFAiWLFGDZ8AKjBzlyriE0CuYuH1qvgEUAias0wZnwByJAuuVccngALU1CUj4BNAqmbmdaPgE0AmbMrlI+ETQIpoxjWj4RNABu6jS0fEJ4BHqol/Pyo+ASQC37tsZHwCqAxgdHwCqAhgBnwCKAxgFnwCKAhgJnwCyAxgNnwCyAhgRnwCSAxgVnwCSAhgZnwCeBDA7PgEcCeACPgEcCOAKPgEcCWASPgE8C2AaPgE8CWAiPgE8B5AVHwCWJYlMn74AKLjhw4A/Ld//0L+ihjwP7/6DRcA+P/+3zdUAOD//8lXmADAv/65d4gAwL/9Xa/pAwD//ve8pw4A/Mc/8TJtAOA/xp/2cwDw0/CnDAD8dPzpAgA/D3+qAMDPx58mAPDL8KcIAPxy/OEDAL8Of+gAwK/HHzYA8G3whwwAfDv84QIA3xZ/qADAt8cfJgDw2+APEQD47fDlAwC/Lb50AOC3x5cNAHwffMkAwPfDlwsAfF98qQDA98eXCQD8PvgSAYDfD797AOD3xe8aAPj98bsFAL4GfpcAwNfBdw8AfC181wDA18N3CwB8TXyXAMDXxW8eAPja+E0DAF8fv1kA4I+B3yQA8MfBNw8A/LHwTQMAfzx8swDAHxPfLIDD4fC8ruuvlDHs+/60bdtLyrVc034CZr8mLiUC8NuD5u5gFsBl43sRgJ9L43O9aQC3IgDfB7NkF/MAvkcAfgmL35omAXxEsCzLX77g88Ms2alZACWHYY3/BAjAf+ZSOxKAFIf/YQjAf+ZSOxKAFIf/YQjAf+ZSOxKAFIf/YQjAf+ZSOxKAFIf/YQjAf+ZSOxKAFIf/YQjAf+ZSOxKAFIf/YQjAf+ZSOxKAFIf/YQjAf+ZSOxKAFIf/YV4BYPjxrg+kg9YAAAAASUVORK5CYII='}}/>
            <Text style={{fontSize: 14, lineHeight: 14, marginLeft: -2, marginBottom: 2, color: '#333'}}>{yaerStr}</Text>
            {
              this.props.isFirstMonth ?
                <View style={{flex:1,flexDirection:'row',justifyContent:'flex-end',paddingBottom:4}}>
                  <View style={{flexDirection: 'row', alignItems: 'center',marginRight:10}}>
                    <View style={{marginRight:3,width: 10, height: 10, borderRadius: 2,backgroundColor: gColor.lightGreen}}/>
                    <Text style={{fontSize: 12, marginLeft: 2, color: '#666'}}>有日报</Text>
                  </View>

                  <View style={{flexDirection: 'row', alignItems: 'center',marginRight:10}}>
                    <View style={{marginRight:3,width: 10, height: 10, borderRadius: 2,backgroundColor: gColor.orange}}/>
                    <Text style={{fontSize: 12, marginLeft: 2, color: '#666'}}>无日报</Text>
                  </View>

                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <View style={{marginRight:3,width: 10, height: 10, borderRadius: 2,backgroundColor:  gColor.red}}/>
                    <Text style={{fontSize: 12, marginLeft: 2, color: '#666'}}>停工</Text>
                  </View>
                </View>:null
            }
            {indicator}
          </View>
          {rightArrow}
        </View>
        {
          !this.props.hideDayNames &&
          <View style={this.style.week}>
            {this.props.weekNumbers && <Text allowFontScaling={false} style={this.style.dayHeader}></Text>}
            {weekDaysNames.map((day, idx) => (
              <Text allowFontScaling={false} key={idx} accessible={false} style={this.style.dayHeader} numberOfLines={1}
                    importantForAccessibility='no'>{day}</Text>
            ))}
          </View>
        }
      </View>
    );
  }
}

export default CalendarHeader;

