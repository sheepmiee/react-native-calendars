import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {
  TouchableWithoutFeedback,
  Text,
  View
} from 'react-native';
import {shouldUpdate} from '../../../component-updater';
import isEqual from 'lodash.isequal';

import * as defaultStyle from '../../../style';
import styleConstructor from './style';

class Day extends Component {
  static propTypes = {
    // TODO: selected + disabled props should be removed
    state: PropTypes.oneOf(['selected', 'disabled', 'today', '']),

    // Specify theme properties to override specific styles for calendar parts. Default = {}
    theme: PropTypes.object,
    marking: PropTypes.any,

    onPress: PropTypes.func,
    onLongPress: PropTypes.func,
    date: PropTypes.object,

    markingExists: PropTypes.bool,
  };

  constructor(props) {
    super(props);
    this.theme = {...defaultStyle, ...(props.theme || {})};
    this.style = styleConstructor(props.theme);
    this.markingStyle = this.getDrawingStyle(props.marking || []);
    this.onDayPress = this.onDayPress.bind(this);
    this.onDayLongPress = this.onDayLongPress.bind(this);
  }

  onDayPress() {
    this.props.onPress(this.props.date);
  }

  onDayLongPress() {
    this.props.onLongPress(this.props.date);
  }

  shouldComponentUpdate(nextProps) {
    const newMarkingStyle = this.getDrawingStyle(nextProps.marking);

    if (!isEqual(this.markingStyle, newMarkingStyle)) {
      this.markingStyle = newMarkingStyle;
      return true;
    }

    return shouldUpdate(this.props, nextProps, ['state', 'children', 'onPress', 'onLongPress']);
  }

  /*
  * 修改处
  * */
  getDrawingStyle(marking) {

    //添加textContainerStyle，文字的圆形框
    const defaultStyle = {textStyle: {}, textContainerStyle: {}};
    if (!marking) {
      return defaultStyle;
    }
    if (marking.disabled) {
      defaultStyle.textStyle.color = this.theme.textDisabledColor;
    } else if (marking.selected) {
      defaultStyle.textStyle.color = this.theme.selectedDayTextColor;

      //这一天的状态为selected时，给文字一个圆形框
      defaultStyle.textContainerStyle.backgroundColor = '#2e7df6';
    }
    const resultStyle = ([marking]).reduce((prev, next) => {
      if (next.quickAction) {
        if (next.first || next.last) {
          prev.containerStyle = this.style.firstQuickAction;
          prev.textStyle = this.style.firstQuickActionText;
          if (next.endSelected && next.first && !next.last) {
            prev.rightFillerStyle = '#c1e4fe';
          } else if (next.endSelected && next.last && !next.first) {
            prev.leftFillerStyle = '#c1e4fe';
          }
        } else if (!next.endSelected) {
          prev.containerStyle = this.style.quickAction;
          prev.textStyle = this.style.quickActionText;
        } else if (next.endSelected) {
          prev.leftFillerStyle = '#c1e4fe';
          prev.rightFillerStyle = '#c1e4fe';
        }
        return prev;
      }

      const color = next.color;
      if (next.status === 'NotAvailable') {
        prev.textStyle = this.style.naText;
      }
      if (next.startingDay) {
        prev.startingDay = {
          color
        };
      }
      if (next.endingDay) {
        prev.endingDay = {
          color
        };
      }
      if (!next.startingDay && !next.endingDay) {
        prev.day = {
          color
        };
      }
      if (next.textColor) {
        prev.textStyle.color = next.textColor;
      }
      return prev;
    }, defaultStyle);
    return resultStyle;
  }

  /*
  * 判断是今天时，添加dot
  * */
  // renderDot() {
  //   return this.props.state === 'today'?<View style={{height:6,width:6,borderRadius:3,backgroundColor:'green'}}/>:null;
  // }

  /*
  * 修改处
  * */
  render() {
    const containerStyle = [this.style.base,{width:40,height:40}];
    const textStyle = [this.style.text];

    //添加textContainerStyle
    const textContainerStyle = [this.style.textContainer];
    let leftFillerStyle = {};
    let rightFillerStyle = {};
    let fillerStyle = {};
    let fillers;

    if (this.props.state === 'disabled') {
      textStyle.push(this.style.disabledText);
    } else if (this.props.state === 'today') {
      containerStyle.push(this.style.today);

      //今天文字加上颜色
      textStyle.push({color:'#2e7df6'});
      // textStyle.push(this.style.todayText);
    }

    //修改为20，即day盒子高度的一半
    if (this.props.marking) {
      containerStyle.push({
        borderRadius: 20
      });

      const flags = this.markingStyle;
      if (flags.textStyle) {
        textStyle.push(flags.textStyle);
      }

      //选中状态时，flags.textContainerStyle有值，添加进textContainerStyle
      if (flags.textContainerStyle){
        textContainerStyle.push(flags.textContainerStyle)
      }
      if (flags.containerStyle) {
        containerStyle.push(flags.containerStyle);
      }
      if (flags.leftFillerStyle) {
        leftFillerStyle.backgroundColor = flags.leftFillerStyle;
      }
      if (flags.rightFillerStyle) {
        rightFillerStyle.backgroundColor = flags.rightFillerStyle;
      }

      if (flags.startingDay && !flags.endingDay) {
        leftFillerStyle = {
          backgroundColor: this.theme.calendarBackground
        };
        rightFillerStyle = {
          backgroundColor: flags.startingDay.color
        };
        containerStyle.push({
          backgroundColor: flags.startingDay.color
        });
      } else if (flags.endingDay && !flags.startingDay) {
        rightFillerStyle = {
          backgroundColor: this.theme.calendarBackground
        };
        leftFillerStyle = {
          backgroundColor: flags.endingDay.color
        };
        containerStyle.push({
          backgroundColor: flags.endingDay.color
        });
      } else if (flags.day) {
        leftFillerStyle = {backgroundColor: flags.day.color};
        rightFillerStyle = {backgroundColor: flags.day.color};
        // #177 bug
        fillerStyle = {backgroundColor: flags.day.color};
      } else if (flags.endingDay && flags.startingDay) {
        rightFillerStyle = {
          backgroundColor: this.theme.calendarBackground
        };
        leftFillerStyle = {
          backgroundColor: this.theme.calendarBackground
        };
        containerStyle.push({
          backgroundColor: flags.endingDay.color
        });
      }

      fillers = (
        <View style={[this.style.fillers, fillerStyle]}>
          <View style={[this.style.leftFiller, leftFillerStyle]}/>
          <View style={[this.style.rightFiller, rightFillerStyle]}/>
        </View>
      );
    }

    //红色的小圆点
    // const dot = this.renderDot();

    return (
      <TouchableWithoutFeedback
        onPress={this.onDayPress}
        onLongPress={this.onDayLongPress}>
        <View style={this.style.wrapper}>
          {fillers}
          <View style={containerStyle}>
            {/*给文字一个圆形框，选中状态时给蓝色背景色*/}
            <View style={textContainerStyle}>
              <Text allowFontScaling={false} style={textStyle}>
                {
                  this.props.state === 'today'
                    ? <Text style={{fontSize:14,fontWeight:'bold'}}>今天</Text> :
                    String(this.props.children)}
              </Text>
            </View>

            {/*当天为今天时，文字下方给一个红色的小圆点标记*/}
            {/*<View style={{flex:1,justifyContent:'center'}}>{dot}</View>*/}
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

export default Day;
