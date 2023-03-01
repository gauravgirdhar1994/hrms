import React from "react";
import jquery from "jquery";

export class ModalTask extends React.Component {
  constructor(props) {
    super(props);
    this.show = this.show.bind(this);
  }

  show() {
    jquery(this.refs.taskModal).modal("show");
  }

  render() {
    let item = this.props.selected;
    return (
      <div
        id="taskModal"
        className="modal fade mt-0 mt-md-5"
        tabIndex="-1"
        role="dialog"
        aria-hidden="true"
        ref="taskModal"
      >
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <div>
                {item ? (
                <h4 className="modal-title">TSK-{item.id}</h4>
                ):null}
              </div>
              <button
                type="button"
                className="close"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">×</span>
                <span className="sr-only">Close</span>
              </button>
            </div>
            <div className="modal-body">
              {item ? (
              <div className="row">
                <div className="col-sm-12">
                  <p className="lead">
                    <img src={item.owner} className="rounded-circle float-right" alt="Owner" />
                    {item.name}
                  </p>
                  <p>
                    {item.description}
                  </p>
                  <table className="table table-bordered">
                    <tbody>
                      <tr>
                        <td>Status</td>
                        <td>{item.status}</td>
                      </tr>
                      <tr>
                        <td>Created</td>
                        <td>{item.created}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              ):null}
              <div className="my-3" />
              <button
                className="btn btn-primary float-right ml-2"
                data-dismiss="modal"
                aria-hidden="true"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ModalTask;
