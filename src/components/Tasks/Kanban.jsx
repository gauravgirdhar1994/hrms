import React from "react";
import ModalTask from "./ModalTask";
import dataTasks from "./data/tasks.json";

export class Kanban extends React.Component {
  constructor(props) {
    super(props);
    this.showDetails = this.showDetails.bind(this);
    this.groupTasks = this.groupTasks.bind(this);
    this.updateStatus = this.updateStatus.bind(this);
    this.getTaskById = this.getTaskById.bind(this);
    this.updateStatus = this.updateStatus.bind(this);
    this.drag = this.drag.bind(this);
    this.drop = this.drop.bind(this);
    this.allowDrop = this.allowDrop.bind(this);
    this.clearDrop = this.clearDrop.bind(this);
    
    this.ModalTask = React.createRef();
    this.state = {
      tasks: [],
      groupedTasks: {},
      initialItems: this.props.data||dataTasks
    };
  }
  
  groupTasks() {
    let tasks = this.state.tasks;
    
    // sort tasks by status for swimlanes
    let sortOrder = ['todo','started','review','complete'];
    let sortedTasks = tasks.slice().sort((a, b) => {  
      return sortOrder.indexOf(a.status) - sortOrder.indexOf(b.status);
    });
    
    this.setState({
      // group tasks by status
      groupedTasks: sortedTasks.reduce((r,a) => {
        r[a.status] = [...r[a.status] || [], a];
        return r;
      }, {})
    });
  }
  
  updateStatus(taskId, status) {
    let tasks = this.state.tasks;
    var task = tasks.find(t => t.id === taskId);
    task.status = status;

    this.setState({ tasks }, function(){});
  }
  
  getTaskById(id) {
    return this.state.tasks.find(t => t.id === id);
  }
  
  showDetails(id) {
    this.setState({
      selected: this.state.tasks.find(t => t.id === id)
    });
    this.ModalTask.current.show();
  }
  
  // helpers
  hasClass(target, className) {
      return new RegExp('(\\s|^)' + className + '(\\s|$)').test(target.className);
  }
  
  addClass(ele,cls) {
    if (!this.hasClass(ele,cls)) ele.className += " "+cls;
  }
  
  removeClass(ele,cls) {
    if (this.hasClass(ele,cls)) {
      var reg = new RegExp('(\\s|^)'+cls+'(\\s|$)');
      ele.className=ele.className.replace(reg,' ');
    }
  }
  
  drag(ev) {
    ev.dataTransfer.setData("text/plain", ev.target.id);
  }

  allowDrop(ev) {
    ev.preventDefault();
    if (this.hasClass(ev.target,"dropzone")) {
      this.addClass(ev.target,"droppable");
    }
  }

  clearDrop (ev) {
    this.removeClass(ev.target,"droppable");
  }

  drop(event) {
    event.preventDefault();
    var id = event.dataTransfer.getData("text/plain");
    var element = document.querySelector(`#${id}`);
    try {
      // delete the spacer in dropzone
      event.target.removeChild(event.target.firstChild);
      
      // add the draggable content
      event.target.appendChild(element);
      
      // remove the dropzone parent
      this.unwrap(event.target);
    } catch (error) {
      console.warn("Can't move the item to the same place");
    }
    
    // get the id of the dropzone's swimlane to determine status
    var swimlane = element.closest('.items');
    var status = swimlane.id;
    var taskId = parseInt(id.replace("tsk_",""), 10); //parseInt is only needed cuz id's in JSON data are numbers
    
    // update the task status and drop areas
    this.updateStatus(taskId, status);
    this.updateDropzones();
  }

  createDropzone() {
    var dz = document.createElement("div");
    dz.classList.add('dropzone');
    dz.ondrop = this.drop;
    dz.ondragover = this.allowDrop;
    dz.ondragleave = this.clearDrop;
    dz.appendChild(document.createTextNode('\u00A0'));
    return dz;
  }

  updateDropzones() {
    /* after dropping, refresh the drop target areas
      so there is a dropzone after each item */
    
    // remove old dropzones and empty divs
    document.querySelectorAll('.dropzone').forEach(function(el) {
      el.parentNode.removeChild(el);
    });
    document.querySelectorAll('.items > div:empty').forEach(function(el) {
      el.parentNode.removeChild(el);
    });
    
    var self = this;
    document.querySelectorAll('.draggable').forEach(function(el) {
      el.insertAdjacentElement('afterend', self.createDropzone());
    });
    
    // insert new dropzone in any empty swimlanes
    if (document.querySelector('.items:empty')) {
      document.querySelector('.items:empty').appendChild(this.createDropzone());
    }
  }

  unwrap(node) {
    node.replaceWith(...node.childNodes);
  }
  
  componentWillMount(){
    this.setState({tasks: this.state.initialItems},function(){
      this.groupTasks();
    });
  }

  render() {
    var { groupedTasks } = this.state;
    return (
      <div className="row flex-grow-1 no-gutters">
        <div className="col-12">
          <div className="row no-gutters">
            <div className="col-sm pb-3"><h3 className="font-weight-light">Tasks</h3></div>
            <div className="col-lg-6 col-md-8 col-12 ml-auto">
              <div className="alert-dismissible fade show alert alert-info py-2 mb-2" role="alert">
                <button type="button" className="close font-weight-light py-1" data-dismiss="alert" aria-label="Close">
                  <span aria-hidden="true">×</span>
                </button>
                Drag-and-drop items between swimlanes to change status.
              </div>
            </div>
          </div>
        </div>
        {groupedTasks ? Object.keys(groupedTasks).map((key) => (
        <div className="col-sm-6 col-md-4 col-xl-3 px-1" key={key}>
          <div className="overflow-hidden h-100 border rounded p-2">
            <h6 className="text-uppercase text-truncate py-2 ml-2">{key}</h6>
            <div className="items h-100 px-1" id={key} ref={key}>
              {groupedTasks[key] && groupedTasks[key].length > 0 ? groupedTasks[key].map((task,k) => (
              <React.Fragment key={k}>
                <div className="card my-1 shadow draggable" data-toggle="tooltip" title="Drag me" id={'tsk_'+task.id} onDragStart={(event) => {this.drag(event)}} draggable="true">
                  <div className="card-body p-2">
                    <div className="card-title">
                        <img src={task.owner} className="rounded-circle float-right" alt="Task owner" />
                        <a href="# " className={(task.status==="complete")?'text-muted':''} onClick={() => this.showDetails(task.id)}>TSK-{task.id}</a>
                    </div>
                    <p>{task.name}</p>
                    <button className="btn btn-primary btn-sm" onClick={() => this.showDetails(task.id)}>View</button>
                    <div className="float-right">
                        {(task.status==="complete")?(<span className="mr-2"><i className="text-success icon icon-check"></i></span>):null}
                        <span className="small badge badge-pill badge-dark">{task.status}</span>
                    </div>
                  </div>
                </div>
                <div className="dropzone" onDrop={(event) => {this.drop(event)}} onDragOver={(event) => {this.allowDrop(event)}} onDragLeave={(event) => {this.clearDrop(event)}}> &nbsp; </div>
              </React.Fragment>)) : <p className="lead">No tasks found.</p>}
            </div>
          </div>
        </div>
        )):null}
        <ModalTask
            ref={this.ModalTask}
            selected={this.state.selected}
          />
      </div>
    );
  }
}

export default Kanban;
