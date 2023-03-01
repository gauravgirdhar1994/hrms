/* ----------- BUTTONS START ----------- */
class ButtonGroup extends React.Component {
  render() {
    return (
      <div className="btn-group btn-group-sm">
          {this.props.buttons}
        </div>
    );
  }
}

class EditButton extends React.Component {
  render() {
    return (
      <button type="button" onClick={this.props.onClick} className="edit btn btn-default" ><span className="glyphicon glyphicon-pencil"></span></button>
    );
  }
}

class DeleteButton extends React.Component {
  render() {
    return (
      <button type="button" onClick={this.props.onClick} className="edit btn btn-default" ><span className="glyphicon glyphicon-trash"></span></button>
    );
  }
}

class ConfirmButton extends React.Component {
  render() {
    return (
      <button type="button" onClick={this.props.onClick} className="edit btn btn-default btn-success" ><span className="glyphicon glyphicon-ok"></span></button>
    );
  }
}

class CancelButton extends React.Component {
  render() {
    return (
      <button type="button" onClick={this.props.onClick} className="edit btn btn-default btn-danger" ><span className="glyphicon glyphicon-remove"></span></button>
    );
  }
}

class FullWidthButton extends React.Component {
  render() {
    return (
      <button type="button" onClick={this.props.onClick} className="btn btn-default btn-block" >{this.props.buttontext}</button>
    );
  }
}

class FullWidthLinkButton extends React.Component {
    render() {
      if (this.props.disabled) {
        var class_name = "btn btn-default btn-block disabled"
      } else {
        var class_name = "btn btn-default btn-block"
      }
      return (
        <a href={this.props.link} className={class_name}>{this.props.buttontext}</a>
      );
    }
  }
  /* ----------- BUTTONS END ----------- */

  /* ------------ RENDERING FUNCTIONS ----------- */
function CellRender(props) {
  return (
    <td onClick={props.onClick}>{props.value}</td>
  );
}

function ParagraphRender(props) {
  return (
    <p>{props.value}</p>
  );
}

function ParagraphInputText(props) {
  // Props = label, id, placeholder, value, onChange
  return (
    <p>
      <label for={props.id}>{props.label}</label>
      <input 
        className="form-control input-sm" 
        value={props.value} 
        id={props.id} 
        placeholder={props.placeholder}
        type="text"
        onChange={props.onChange}></input>
    </p>
  );
}

function ParagraphInputTextArea(props) {
  // Props = label, id, placeholder, value, onChange
  return (
    <p>
      <label for={props.id}>{props.label}</label>
      <textarea 
        className="form-control input-sm" 
        value={props.value} 
        id={props.id} 
        placeholder={props.placeholder}
        type="text"
        onChange={props.onChange}>
      </textarea>
    </p>
  );
}

function TableCellInputText(props) {
  // Props = label, id, placeholder, value, onChange
  return (
    <td>
      <input 
          className="form-control input-sm"
          type="text"
          value={props.value}
          id={props.id}
          placeholder={props.placeholder}
          onChange={props.onChange}>
        </input>
    </td>
  );
}
/* ------------ RENDERING FUNCTIONS END ------- */

/* ------------ HOC DEFINITIONS ----------- */
var DisplayField = (Wrapped) => class extends React.Component {
  //Props = field and onClick
  render() {
    return (
      <Wrapped 
        value = {this.props.field.value} 
        onClick = {this.props.onClick} 
        />
    );
  }
}

var EditField = (Wrapped) => class extends React.Component {
  // Props: field, sendValueToParent
  constructor(props) {
    super(props);
    this.state = {
      value: this.props.field.value
    };
    this.handleFieldChange = this.handleFieldChange.bind(this);
  }
  handleFieldChange(e) {
    this.setState({
      value: e.target.value
    });
    // Send value back to row - note: state is too slow
    var state_update = {};
    state_update[this.props.field.name] = e.target.value;
    this.props.sendValueToParent(state_update);
  }
  render() {
    return (
      <Wrapped 
          label={this.props.field.header}
          value={this.state.value}
          id={this.props.field.name}
          placeholder={this.props.field.placeholder}
          onChange={this.handleFieldChange}
        />
    );
  }
}

// So to return a Display field for a panel I have
// var DisplayField = DisplayField(ParagraphRender);
// This is passed as props?
// var buttons = [<EditButton onClick={this.props.handleEditModeClick}/>, <DeleteButton onClick={this.props.handleDeleteClick}/>];

class DisplayInstance extends React.Component {
  // Props - render, instance data, handleSelect
  // 
  render() {
    var render_fields = [];
    const DF = DisplayField(this.props.render);
    this.props.instancedata.forEach(function(field) {
      render_fields.push(<DF onClick={this.props.handleSelect} field={field} key={field.name}/>);
    }, this);
    // Set selected status - this is props - return method
    // Can't have this div below
    return (
      <div>
        {render_fields}
      </div>
    );
  }
}

/*var field = {
          header: fd.header,
          length: fd.length,
          name: fd.name,
          placeholder: fd.placeholder,
          value: this.state.instance[fd.name]
        };*/
// What if we want different renders for different fields?
class EditInstance extends React.Component {
  // Props = instancedata - list of fields as above
  // editrender and displayrender, updateValue
  render() {
    var render_fields = [];
    // Do these need to be passed as a list of renders?
    var EF = EditField(this.props.editrender);
    var DF = DisplayField(this.props.displayrender);
    this.props.instancedata.forEach(function(field) {
      if (field.inputfield) {
        render_fields.push(<EF field={field} key={field.name} sendValueToParent={this.props.updateValues}/>);
      } else {
        render_fields.push(<DF onClick={""} field={" "} key={field.name}/>);
      };
    }, this);
    return (
      <span>{render_fields}</span>
    );
  }
}

var InstanceContainer = (Wrapped) => class extends React.Component {
    // Props = fielddata, instancedata - [{"name":"value}, ..]
    constructor(props) {
      super(props); 
      console.log("render IC");
      this.handleSelectRow = this.handleSelectRow.bind(this);
      this.handleEditModeClick = this.handleEditModeClick.bind(this);
      this.handleExitEditModeClick = this.handleExitEditModeClick.bind(this);
      this.handleDeleteClick = this.handleDeleteClick.bind(this);
      this.handleConfirmEditClick = this.handleConfirmEditClick.bind(this);
      this.updateValues = this.updateValues.bind(this);

      var editMode = false;
      var added = false;
      // If no created date then row is a newly added row
      if (!this.props.instance.date_created) {
        editMode = true;
        added = true;
      }
      /*
      var instance = {}
      this.props.fielddata.forEach(function(fd) {
        instance[fd.name] = this.props.instance[fd.name];
      }, this);
      instance.id = this.props.instance.id;
      */
      var state = {}
      this.props.fielddata.forEach(function(fd) {
        // Only need to store state for inputfields
        if (fd.inputfield) {
          state[fd.name] = this.props.instance[fd.name];
        }
      }, this);
      state.editMode = editMode;
      state.deleted = false;
      state.added = added;
      state.selected = false;
      this.state = state;
      //console.log(this.state);
    }

    handleSelectRow() {
      if (!this.state.selected) {
        this.setState({
          selected: true
        });
      } else {
        this.setState({
          selected: false
        });
      }
      this.props.setSelected(this.props.instance.id);
    }

    handleEditModeClick() {
      this.setState({
        editMode: true
      });
    }

    handleExitEditModeClick() {
      
      this.setState({
        editMode: false
      });
      
      var instance = {}
      this.props.fielddata.forEach(function(fd) {
        if (fd.inputfield) {
          instance[fd.name] = this.props.instance[fd.name];
        }
      }, this);
      
      this.setState(instance);
      if (this.state.added) {
        this.setState({
          deleted: true
        });
      }
    }

    handleDeleteClick() {
      this.setState({
        deleted: true
      });
      console.log("AJAX DELETE");
      console.log(this.state.instance.id);
    }

    handleConfirmEditClick() {
      // CONFIRM revised_instance
      this.setState({
        editMode: false
      });
      if (this.state.added) {
        console.log("AJAX POST");
        // Loop through fielddata inputs here to build postable object
        //console.log(this.state.instance);
      } else {
        console.log("AJAX PATCH");
        //console.log(this.state.instance);
        // Reset added flag
        this.setState({
          added: false
        });
      }
    }

    updateValues(update) {
      // It is redrawing the EditInstance for some reason
      // when the state updates
      // - in the table version only the input updates
      // still re-renders even when not using Edit Instance
      this.setState(update);
      
}
   

    render() {
      let buttons = null;
      let rendered_instance = null;
      if (this.state.deleted) {
        const deletedHTML = this.props.deletedHTML;
        //<td></td> - for table
        // <div></div> - for panel
        return ({
          deletedHTML
        });
      }
      // Assemble metadata and values
      var fields = [];
      this.props.fielddata.forEach(
        function(fd) {
          fd['value'] = this.state[fd.name];
          fields.push(fd);
        }, this);
      if (this.state.editMode) {
        buttons = [
          <ConfirmButton onClick={this.handleConfirmEditClick}/>,
          <CancelButton onClick={this.handleExitEditModeClick}/>
        ];
        var render_fields = [];
        // Do these need to be passed as a list of renders?
        var EF = EditField(this.props.editrender);
        var DF = DisplayField(this.props.displayrender);
        fields.forEach(function(field) {
          if (field.inputfield) {
            render_fields.push(<EF field={field} key={field.name} sendValueToParent={this.updateValues}/>);
          } else {
            render_fields.push(<DF onClick={""} field={" "} key={field.name}/>);
      };
        }, this);
        rendered_instance = render_fields;
        //rendered_instance = <EditInstance updateValues={this.updateValues} instancedata ={fields} displayrender = {this.props.displayrender} editrender ={this.props.editrender}/>
      } else {
        // In display mode - add edit/delete buttons
        buttons = [
          <EditButton onClick={this.handleEditModeClick}/>,
          <DeleteButton onClick={this.handleDeleteClick}/>
        ];
        rendered_instance = <DisplayInstance instancedata={fields} render = {this.props.displayrender} />
      };
      return (
        <Wrapped
                selected={this.props.instance.selected}
                rendered_instance={rendered_instance}
                buttons={buttons}
          />

      );
    }
  }

function TableRow(props) {
  return (
    <tr className={props.selected ? "success" : ""}>
      {props.rendered_instance}
      <td><ButtonGroup buttons={props.buttons}/></td>
    </tr>
  );
}

function PanelContent(props) {
  return (
    <div className="row">
      <div id="datapane" className="col-sm-8 col-md-9 col-lg-10">
        {props.rendered_instance}
      </div> 
      <div className="col-sm-4 col-md-3 col-lg-2 panelright">
        <ButtonGroup buttons={ props.buttons } />
      </div>
    </div>
  );
}

class TabGroup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activetab: 0
    };
  }

  switchTab(index) {
    console.log(index);
    this.setState({
      activetab: index
    });
  }

  render() {
    var tab_header = [];
    this.props.tabs.forEach(function(tab) {
      // Check if tab is active
      var current_index = this.props.tabs.indexOf(tab);
      if (current_index == this.state.activetab) {
        // Tab is active
        tab_header.push(<button className="btn btn-default active">{tab.title}</button>);
      } else {
        // Tab is not active
        tab_header.push(<button className="btn btn-default">{tab.title}</button>);
      }
    }, this);
    return (
      <div id="tabview" className="top-buffer">
        <div className="btn-group">
          {tab_header}
        </div>
      </div>
    );
  }
}

class PanelLeftPane extends React.Component {
  //obj_type().charAt(0).toUpperCase() + obj_type().slice(1)
  //"text: '(' + legal_basis() + ')'"
  render() {
    return (
      <div className="col-sm-3 col-lg-2"> 
        <div className="panelleftpane">
          <h4>{this.props.subtitle1}</h4>
          <h5>{this.props.subtitle2}</h5>
        </div>
      </div>
    );
  }
}


class ChildPanel extends React.Component {
    //Props: title
    render() {
      return (
        <div className="childpanel row">
        <div className="col-sm-9 col-sm-offset-3 col-lg-10 col-lg-offset-2">
          <Panel title={this.props.title}/>
        </div>
     </div>
      );
    }
  }

class Panel extends React.Component {
  /* Panels and table rows differ in:
      - rendered HTML
      - selection
  
      Both are special cases of a more general EditableObject class?
      */
  /*Props - in an object structure?
  paneldata = {title: "title", leftpanel={subtitle1: "substitle1", subtitle2: "substitle2"}, data=[]}
  */
  // Conditional display of left panel based on flag?
  // Have an "edit" state like table row?
  render() {
    return (
      <div
        className="row panel"
        >
        <legend>{this.props.title}</legend>
        <PanelLeftPane 
          subtitle1={this.props.subtitle1} 
          subtitle2={this.props.substitle2}
          />
        <PanelDisplayPane 
          data={[{text:"1"},{text:"2"},{text:"3"}]}
          />
        <PanelRightPane buttons={""}/>
      </div>
    );
  }
}

class PanelContainer extends React.Component {
  render() {
    //label, id, placeholder, value, onChange

    return (
      <div className="panelcontainer">
        <Panel title={"Objection"}/>
        <ChildPanel title={"Analysis"}/>
        <ChildPanel title={"Amendments"}/>
        <EditableInstance setSelectedRow={""} instance={objectiondata.instances[0]} fielddata={objectiondata.fielddata} key={objectiondata.instances[0].id}/>
        
      </div>
    );
  }
}

class Objection extends React.Component {
  // Has an instance and fielddata as props
  render() {
    return (
      ""
    );
  }
}

class Analysis extends React.Component {
  // Has an instance and fielddata as props
  render() {
    return (
      ""
    );
  }
}

class Amendment extends React.Component {
  // Has an instance and fielddata as props
  render() {
    return (
      ""
    );
  }
}

// Test data from API
var objectiondata = {
  "api_uri": "http://localhost/oar/objections/data/",
  "fielddata": [{
    "header": "Objection Type",
    "inputfield": true,
    "length": 10,
    "name": "obj_type",
    "placeholder": ""
  }, {
    "header": "Legal Basis",
    "inputfield": true,
    "length": 10,
    "name": "legal_basis",
    "placeholder": "Please provide the legal provision under which the objection is raised, e.g. Article 84 EPC."
  }, {
    "header": "Associated Section of Office Action",
    "inputfield": true,
    "length": 10,
    "name": "oa_section",
    "placeholder": "Please provide the section of the office action in which the objection is raised, e.g. 1 or 3.1."
  }, {
    "header": "Associated Part of Application",
    "inputfield": true,
    "length": 10,
    "name": "appln_section",
    "placeholder": "Please provide the objectionable section of the application, e.g. claim 1 or paragraph 2, page 12."
  }, {
    "header": "Summary of objection",
    "inputfield": true,
    "length": 20,
    "name": "short_desc",
    "placeholder": "Please provide a short description of the objection, e.g. Term X is deemed unclear."
  }, {
    "header": "Objection Reasoning",
    "inputfield": true,
    "length": 30,
    "name": "reason",
    "placeholder": "Please provide the Examiner's reasoning for the objection, e.g. Disclosed in paragraph X of D1."
  }],
  "instances": [{
    "appln_section": "fdgsdfgsdg",
    "childlinks": [{
      "name": "Analysis",
      "uri": "http://localhost/oar/analysis/data/?parent_id=1"
    }, {
      "name": "Amendment",
      "uri": "http://localhost/oar/amendments/data/?parent_id=1"
    }],
    "date_created": "16 November 2016",
    "date_modified": "16 November 2016",
    "id": 1,
    "legal_basis": "fsdgfdsg",
    "oa_section": "fdgdfsgsd",
    "obj_type": "novelty",
    "parent_id": 1,
    "reason": "dfgfdsgsdg",
    "short_desc": "dsfgfdsgsd",
    "uri": "http://localhost/oar/objections/data/1"
  }, {
    "appln_section": "sadfsaf",
    "childlinks": [{
      "name": "Analysis",
      "uri": "http://localhost/oar/analysis/data/?parent_id=2"
    }, {
      "name": "Amendment",
      "uri": "http://localhost/oar/amendments/data/?parent_id=2"
    }],
    "date_created": "20 November 2016",
    "date_modified": "20 November 2016",
    "id": 2,
    "legal_basis": "sdafsadf",
    "oa_section": "sdafsdaf",
    "obj_type": "clarity",
    "parent_id": 1,
    "reason": "safdsfsdf",
    "short_desc": "sadfasdf",
    "uri": "http://localhost/oar/objections/data/2"
  }]
}

const analysisdata1 = {
  "api_uri": "http://localhost/oar/analysis/data/",
  "fielddata": [{
    "header": "Is objection valid?",
    "inputfield": true,
    "length": 10,
    "name": "valid",
    "placeholder": ""
  }, {
    "header": "Reason objection is valid / not valid",
    "inputfield": true,
    "length": 30,
    "name": "reason",
    "placeholder": "Please provide evidence that supports your conclusion"
  }],
  "instances": [{
    "childlinks": [],
    "date_created": "16 November 2016",
    "date_modified": "16 November 2016",
    "id": 1,
    "parent_id": 1,
    "reason": "gfhfghfgh",
    "uri": "http://localhost/oar/analysis/data/1",
    "valid": false
  }]
}

const analysisdata2 = {
  "api_uri": "http://localhost/oar/analysis/data/",
  "fielddata": [{
    "header": "Is objection valid?",
    "inputfield": true,
    "length": 10,
    "name": "valid",
    "placeholder": ""
  }, {
    "header": "Reason objection is valid / not valid",
    "inputfield": true,
    "length": 30,
    "name": "reason",
    "placeholder": "Please provide evidence that supports your conclusion"
  }],
  "instances": []
}

const amendmentdata1 = {
  "api_uri": "http://localhost/oar/amendments/data/",
  "fielddata": [{
    "header": "Associated Part of Application",
    "inputfield": true,
    "length": 30,
    "name": "appln_section",
    "placeholder": "E.g. claim 1 or page 3 line 34 or paragraph [0050]"
  }, {
    "header": "Please Indicate Proposed Amendment",
    "inputfield": true,
    "length": 50,
    "name": "change",
    "placeholder": "E.g. [old phrase] amended to [new phrase]."
  }, {
    "header": "Basis in Application as filed",
    "inputfield": true,
    "length": 50,
    "name": "basis",
    "placeholder": "Please cite the basis for the amendment."
  }, {
    "header": "Reason amendment addresses objection",
    "inputfield": true,
    "length": 50,
    "name": "reason",
    "placeholder": "Please provide evidence that supports your conclusion."
  }],
  "instances": [{
    "appln_section": "fhfghfg",
    "basis": "fghfhfh",
    "change": "fghhfdh",
    "childlinks": [],
    "date_created": "16 November 2016",
    "date_modified": "16 November 2016",
    "id": 1,
    "parent_id": 1,
    "reason": "fghfghfghdf",
    "uri": "http://localhost/oar/amendments/data/1"
  }]
}

const amendmentdata2 = {
  "api_uri": "http://localhost/oar/amendments/data/",
  "fielddata": [{
    "header": "Associated Part of Application",
    "inputfield": true,
    "length": 30,
    "name": "appln_section",
    "placeholder": "E.g. claim 1 or page 3 line 34 or paragraph [0050]"
  }, {
    "header": "Please Indicate Proposed Amendment",
    "inputfield": true,
    "length": 50,
    "name": "change",
    "placeholder": "E.g. [old phrase] amended to [new phrase]."
  }, {
    "header": "Basis in Application as filed",
    "inputfield": true,
    "length": 50,
    "name": "basis",
    "placeholder": "Please cite the basis for the amendment."
  }, {
    "header": "Reason amendment addresses objection",
    "inputfield": true,
    "length": 50,
    "name": "reason",
    "placeholder": "Please provide evidence that supports your conclusion."
  }],
  "instances": []
}

var tabs = [{
    "title": "Enter Objections",
    "tab": "<Tab1 />"
  }, {
    "title": "Analyse Objections",
    "tab": "<Tab2 />"
  }, {
    "title": "Add Amendments",
    "tab": "<Tab2 />"
  }, ]
  
class TestContainer extends React.Component {
  render () {
    var IC = InstanceContainer(PanelContent);
    var IC2 = InstanceContainer(TableRow);
    return (
      <div>
        <IC displayrender={ParagraphRender} editrender={ParagraphInputText} fielddata={objectiondata.fielddata} instance={objectiondata.instances[0]}/>
        <IC2 displayrender={CellRender} editrender={TableCellInputText} fielddata={objectiondata.fielddata} instance={objectiondata.instances[0]}/>
      </div>
    );
  }
}


ReactDOM.render(
  <TestContainer/>,
  document.getElementById("container")
);