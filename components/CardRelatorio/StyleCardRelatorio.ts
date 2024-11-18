import {StyleSheet } from 'react-native'

const styles = StyleSheet.create({
    container: {
      height:100,
      backgroundColor: '#EFEFEF',
      width: '90%',
      borderRadius:15,
      flexDirection:'row',
      justifyContent:'space-around',
      alignItems:'center',
      marginBottom:10,
      alignSelf: 'center',
    },
   
    txtDtRelatorio:{
      
      textAlign:'center',
      textAlignVertical:'center',
      fontSize:18,
      fontWeight:'500',
      
    },
    
    txtPresenca:{
      
      fontSize:18,
      textAlign:'right',
      textAlignVertical:'center',
      
      color:'#3B73BD'
    },
    txtObservacao:{
      fontSize:18,
    }
});

export default styles;