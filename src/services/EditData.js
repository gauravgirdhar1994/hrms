export function EditData(datas, apiUrl, token){
  //const apiUrl = 'http://apihrmsuat.91wheels.com/api/employee/edit/personal/1101';
        var bearer = token;
        const options = {
          method: 'POST',
          headers:{
            'Authorization': bearer,
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify(datas)
        };
        console.log(datas)
        fetch(apiUrl, options)
          .then(res => {
              res.json()
              console.log(res.json)
            })
          .then(result => {
              console.log(result)
            this.setState({
              response: result
            })
            window.confirm('Lead is added successfully', this.state.response)
          },
          (error) => {
            this.setState({ error });
            alert('fail')
          }
        )
}