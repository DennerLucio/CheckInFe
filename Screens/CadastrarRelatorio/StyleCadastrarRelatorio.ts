import {StyleSheet } from 'react-native'

const styles = StyleSheet.create({
    container: {
     flex:1,
     width:'100%',
     justifyContent:'center',
     alignItems:'center',
     paddingBottom:15,
     gap:15,
    },

    containerTop:{
      width:'100%',
      height:'40%'
      
    },
    
    ofertaVisitantes:{
      flexDirection:'row',
      width: '100%',
      height:70,
    },
    txtOferta:{
      fontSize:18
    },
    txtVisitantes:{
      
      fontSize:18,
      
    },
    visitantes:{
      gap:10,
      paddingLeft:10,
      width:'50%',
      height:45,
      flexDirection:'row',
      justifyContent:'flex-start',
      alignItems:'center',
    },
    itens:{
     
    },
    inputObs:{
      width: '100%',
      height: 40,
      borderColor: '#ccc',
      borderWidth: 1,
      
      
      borderRadius: 7,
    },
    obs:{
      gap:10,
      paddingLeft:10,
      width:'70%',
      height:45,
      flexDirection:'row',
      justifyContent:'flex-start',
      alignItems:'center',
    },
    oferta:{
      paddingLeft:10,
      gap:10,
      width:'50%',
      height:45,
      flexDirection:'row',
      justifyContent:'flex-start',
      alignItems:'center',

    },
    
    inputOferta:{
      
      width: 75,
      height: 40,
      borderColor: '#ccc',
      borderWidth: 1,
      borderRadius: 7,
    },
    inputVisitantes:{
      
      width: 75,
      height: 40,
      borderColor: '#ccc',
      borderWidth: 1,
     
      borderRadius: 7,
    },

    containerBottom: {
    
      width:'90%',
      flex:1,
      padding:10,
      flexDirection:'column',
      backgroundColor:'#EFEFEF',
      alignItems: 'flex-start',
      
    },
    containerCheckbox:{
      flex:1,
      flexDirection:'row',
      alignItems:'center',
      justifyContent: 'flex-start',
    },
    paragraph: {
      fontSize: 19,
    },
    checkbox: {
      margin: 8,
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
    form:{
      height:'auto',
      width:"100%",
      gap:10,
      paddingTop:15,
      paddingRight:15,
      paddingLeft:15,
    },
    label:{
      width: "auto",
      height: "auto", 
      fontSize:18,
      
    },
    containerAlunos:{
      width:'100%'

    },
    input:{
        width: 100,
        height: 35, 
        borderColor: 'rgba(0, 0, 0, 0.1)', 
        borderWidth: 1, 
        textAlign:'center',
        borderRadius: 5, 
    },
    labelinputs:{
      width:"100%",
      height:'auto',
      flexDirection:'row',
      justifyContent:'space-between',
      alignItems:'center',
      gap:25,
    },
    comboboxprofessorid:{
      width:150,
      height: 40,

    },
    observation:{
      width: 200,
        height: 35,
        borderColor: 'rgba(0, 0, 0, 0.1)', 
        borderWidth: 1, 
        borderRadius: 5,
        textAlign:'center',
    }
});

export default styles;