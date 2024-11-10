import {StyleSheet } from 'react-native'

const styles = StyleSheet.create({
    container: {
      height:75,
      backgroundColor: '#EFEFEF',
      width: '90%',
      borderRadius:12,
      flexDirection:'row',
      justifyContent:'center',
      alignItems:'center',
      marginBottom:15,
      elevation: 5,
    },
    txtTituloTurma:{
      height:'100%',
      width:'100%',
      textAlign:'center',
      textAlignVertical:'center',
      fontSize:22,
      fontWeight:'500',
      color:'#3B73BD'
    },
    
    ContainerNumTurma:{
      width:'40%',
      height:'100%',
      justifyContent:'center',
      alignItems:'center',
      
    },
    txtNumTurma:{
      fontSize:24,
      width:'100%',
      height:'100%',
      textAlign:'right',
      textAlignVertical:'center',
      paddingRight:10,
      color:'#3B73BD'
    },
   
    list: {
      flexGrow: 1,
      width: '100%',
  },
  listContent: {
      flexGrow: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingBottom: 20,
  },
});

export default styles;