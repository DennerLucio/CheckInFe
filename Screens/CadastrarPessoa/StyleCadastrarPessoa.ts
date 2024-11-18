import {StyleSheet } from 'react-native'

const styles = StyleSheet.create({
    container: {
      flex:1,
      backgroundColor: '#FFF',
      width: '100%',
      justifyContent:'flex-start',
      alignItems:'center',
      gap:15,
      paddingTop:30
    },
    inputNome:{
      width:'70%',
      height:40,
      textAlign:'center',
    
      backgroundColor:'#EFEFEF',
      borderRadius:10,
    },
    inputComboBoxCadastarPessoa:{
      width:'70%',
      height:30,
      backgroundColor:'#EFEFEF',
      borderRadius:10,
    },
    btnSubmit:{
      width: '70%',
      height: 40,
      backgroundColor: '#007bff',
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 7,
    },
    btnSubmitText:{
      color: '#fff',
      fontSize: 18,
    },
    textTitulo:{
      fontSize:18,
      fontWeight:'600'
    }
});

export default styles;