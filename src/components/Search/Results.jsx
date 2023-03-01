import React from "react";
import ModalDetail from "./ModalDetail";
import dataResults from "./data/results.json";

const columns = [
  {'name':'1 column','class':'col-12'},
  {'name':'2 columns','class':'col-sm-6'},
  {'name':'3 columns','class':'col-sm-4'}
];

export class Results extends React.Component {
  constructor(props) {
    super(props);
    this.showDetails = this.showDetails.bind(this);
    this.changeColSize = this.changeColSize.bind(this);
    this.filterResults = this.filterResults.bind(this);
    this.ModalDetail = React.createRef();
    this.state = {
      results: [],
      initialItems: this.props.data||dataResults,
      colSize: columns[1].class
    };
  }
  
  filterResults = (evt) => {
    let updatedList = this.state.initialItems;
    updatedList = updatedList.filter(function(item){
      return item.company_name.toLowerCase().indexOf(
        evt.target.value.toLowerCase()) !== -1;
    });
    this.setState({results:updatedList});
  }
  
  showDetails(idx) {
    this.setState({
      selected: this.state.results[idx]
    });
    this.ModalDetail.current.show();
  }
  
  changeColSize(size) {
    this.setState({
      colSize: size
    });
  }
  
  componentWillMount(){
    this.setState({results: this.state.initialItems});
  }

  render() {
    var { results, colSize } = this.state;
    return (
      <div className="row">
          <form className="col-sm pb-2 text-right">
            <input
              type="text"
              className="form-control rounded-0 bg-transparent border-secondary border-top-0 border-right-0 border-left-0"
              placeholder="Filter..."
              onChange={evt => this.filterResults(evt)}
              name="inputQuery"
            />
          </form>
          <div className="col-sm-auto align-self-center">
            {columns.map((col,k) => (
            <button key={k} className={'btn btn-sm btn-outline-primary ml-1 ' + (colSize===col.class?'active':'')} onClick={() => this.changeColSize(col.class)}>
              {col.name}
            </button>
            ))}
          </div>
          <div className="w-100"></div>
          {results && results.length > 0 ? results.map((item,key) =>
            (
            <div className={'py-3 ' + colSize} key={key}>
                <div className="card h-100 shadow-sm">
                  <div className="card-body">
                    <h5 className="card-title"><a href="# " onClick={() => this.showDetails(key)}>{item.company_name}</a></h5>
                    <h6 className="card-subtitle mb-2 text-muted">{item.heading}</h6>
                    <p>{item.description}</p>
                  </div>
                  <div className="card-footer">
                    <button className="btn btn-primary" onClick={() => this.showDetails(key)}>View</button>
                  </div>
                </div>
            </div>
            )
          ) :
            <div className="col-12">No results found.</div>
          }
          <ModalDetail
            ref={this.ModalDetail}
            selected={this.state.selected}
          />
      </div>
    );
  }
}

export default Results;
