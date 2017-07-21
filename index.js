'use strict';

import React, {Component, PropTypes} from 'react';
import {View, Text, TouchableHighlight, Image, TouchableOpacity, ScrollView, Animated, Easing} from 'react-native';

var isFirst = true;
var isSec = true;
 class DropdownMenu extends Component {

  constructor(props, context) {
    super(props, context);

  
    

    var selectIndex = new Array(this.props.data.length);
    for (var i = 0; i < selectIndex.length; i++) {
      selectIndex[i] = 0;
    }
    this.state = {
      activityIndex: -1,
      selectIndex: selectIndex,
      rotationAnims: props.data.map(() => new Animated.Value(0)),
      isFirst:true,
    };

    this.defaultConfig = {
      bgColor: 'grey',
      tintColor: 'white',
      selectItemColor: "red",
      arrowImg: './img/dropdown_arrow.png',
      checkImage: './img/menu_check.png'
    };

  }

  renderChcek(index, title) {
    var activityIndex = this.state.activityIndex;
    if (this.state.selectIndex[activityIndex] == index) {
      var checkImage = this.props.checkImage ? this.props.checkImage : require('./img/menu_check.png');
      return (
        <View style={{flex: 1, justifyContent: 'space-between', alignItems: "center", paddingHorizontal: 15, flexDirection: 'row'}} >
          <Text style={{color: this.props.selectItemColor ? this.props.selectItemColor : this.defaultConfig.selectItemColor}} >{title}</Text>
          <Image source={checkImage} />
        </View>
      );
    } else {
      return (
        <View style={{flex: 1, justifyContent: 'space-between', alignItems: "center", paddingHorizontal: 15, flexDirection: 'row'}} >
          <Text style={{color: this.props.tintColor}} >{title}</Text>
        </View>
      );
    }
  }

  renderActivityPanel() {
    if (this.state.activityIndex >= 0) {

      var currentTitles = this.props.data[this.state.activityIndex];

      var heightStyle = {};
      if (this.props.maxHeight && this.props.maxHeight < currentTitles.length * 44) {
        heightStyle.height = this.props.maxHeight;
      }

      return (
        <View style={{position: 'absolute', left: 0, right: 0, top: 40, bottom: 0}}>
          <TouchableOpacity onPress={() => this.openOrClosePanel(this.state.activityIndex)} activeOpacity={1} style={{position: 'absolute', left: 0, right: 0, top: 0, bottom: 0}}>
            <View style={{opacity: 0.4, backgroundColor: 'black', flex: 1 }} />
          </TouchableOpacity>

          <ScrollView style={[{position: 'absolute', top: 0, left: 0, right: 0, backgroundColor: 'white'}, heightStyle]} >
            {
              currentTitles.map((title, index) =>
                <TouchableOpacity key={index} activeOpacity={1} style={{flex: 1, height: 44}} onPress={this.itemOnPress.bind(this, index)} >
                  {this.renderChcek(index, title)}
                  <View style={{backgroundColor: '#F6F6F6', height: 1, marginLeft: 15}} />
                </TouchableOpacity>
              )
            }
          </ScrollView>
        </View>
      );
    } else {
      return (null);
    }
  }

  openOrClosePanel(index) {

   if (index ==0) {
       if (isFirst) {isFirst = false};
   }else{
       if (isSec) {isSec = false};
   };
    this.props.bannerAction ? this.props.bannerAction() : null;

    // var toValue = 0.5;
    if (this.state.activityIndex == index) {
      this.closePanel(index);
      this.setState({
        activityIndex: -1,
      });
      // toValue = 0;
    } else {
      if (this.state.activityIndex > -1) {
        this.closePanel(this.state.activityIndex);
      }
      this.openPanel(index);
      this.setState({
        activityIndex: index,
      });
      // toValue = 0.5;
    }
    // Animated.timing(
    //   this.state.rotationAnims[index],
    //   {
    //     toValue: toValue,
    //     duration: 300,
    //     easing: Easing.linear
    //   }
    // ).start();
  }

  openPanel(index) {
    Animated.timing(
      this.state.rotationAnims[index],
      {
        toValue: 0.5,
        duration: 300,
        easing: Easing.linear
      }
    ).start();
  }

  closePanel(index) {
    Animated.timing(
      this.state.rotationAnims[index],
      {
        toValue: 0,
        duration: 300,
        easing: Easing.linear
      }
    ).start();
  }

  itemOnPress(index) {
    if (this.state.activityIndex > -1) {
      var selectIndex = this.state.selectIndex;
      selectIndex[this.state.activityIndex] = index;
      this.setState({
        selectIndex: selectIndex
      });
      if (this.props.handler) {
        this.props.handler(this.state.activityIndex, index);
      }
    }
    this.openOrClosePanel(this.state.activityIndex);
  }

  renderDropDownArrow(index) {
    var icon = this.props.arrowImg ? this.props.arrowImg : require('./img/dropdown_arrow.png');

    return (
      <Animated.Image
        source={icon}
        style={{width:6,height:4, marginLeft: 8, transform: [{
          rotateZ: this.state.rotationAnims[index].interpolate({
            inputRange: [0, 1],
            outputRange: ['0deg', '360deg']
          })
        }]}} />
    );
  }

   _getTit(rows,index){
   
   	if (index==0) {
	    if (isFirst) {
	    	
	        return  this.props.dafaultTitle[index];
	     };
	   
   	}else{
        if (isSec) {
                
            return  this.props.dafaultTitle[index];
	     };
   	};
     return  rows[this.state.selectIndex[index]];
   }
  render() {

    return (
      <View style={{flexDirection: 'column', flex: 1}} >
        <View style={{flexDirection: 'row', backgroundColor: this.props.bgColor ? this.props.bgColor : this.defaultConfig.bgColor,borderBottomColor:'#ebebeb',borderBottomWidth:0.5}} >

          {
            this.props.data.map((rows, index) =>
            	
              <TouchableOpacity
                activeOpacity={1}
                onPress={this.openOrClosePanel.bind(this, index)}
                key={index}
                style={{flex: 1, height: 40, alignItems: "center", justifyContent: "center"}} >
                <View style={{flexDirection: 'row', alignItems: "center", justifyContent: "center"}} >
                  <View style={{flexGrow:1,height:13}}></View>
                  <Text style={{color: this.props.tintColor ? this.props.tintColor : this.defaultConfig.tintColor, fontSize: 13}} >{this._getTit(rows,index) }</Text>
                  {this.renderDropDownArrow(index)}
                  <View style={{flexGrow:1,height:13,borderRightWidth:0.5,borderRightColor:'#ebebeb'}}></View>
                </View>
              </TouchableOpacity>
            )
          }
        </View>
        {this.props.children}

        {this.renderActivityPanel()}

      </View>
    );
  }

}

// this.defaultConfig = {
//       bgColor: 'grey',
//       tintColor: 'white',
//       selectItemColor: "red",
//       arrowImg: './img/dropdown_arrow.png',
//       checkImage: './img/menu_check.png'
//     };



DropdownMenu.propTypes = {
  bgColor: PropTypes.string,
  tintColor:PropTypes.string,
  selectItemColor:PropTypes.string,
  arrowImg:PropTypes.number,
  checkImage:PropTypes.number,
  data:PropTypes.array,
  bannerAction:PropTypes.func,
  dafaultTitle:PropTypes.array,

}

export default DropdownMenu;
