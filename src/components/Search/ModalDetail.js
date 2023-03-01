import React from "react";
import jquery from "jquery";

export class ModalDetail extends React.Component {
  constructor(props) {
    super(props);
    this.show = this.show.bind(this);
  }

  show() {
    jquery(this.refs.detailModal).modal("show");
  }

  render() {
    let item = this.props.selected;
    return (
      <div
        id="detailModal"
        className="modal fade mt-0 mt-md-5"
        tabIndex="-1"
        role="dialog"
        aria-hidden="true"
        ref="detailModal"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <div>
                {item ? (
                <h4 className="modal-title">{item.company_name}</h4>
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
                  <h4>
                      {item.heading}
                  </h4>
                </div>
                <div className="col-sm-12">
                  <p className="lead">{item.description}</p>
                  <table className="table table-bordered">
                    <tbody>
                      <tr>
                        <td>Contact</td>
                        <td>{item.first_name} {item.last_name}</td>
                      </tr>
                      <tr>
                        <td>Email</td>
                        <td>{item.email} ({item.ip_address})</td>
                      </tr>
                      <tr>
                        <td>App</td>
                        <td>{item.app_name}</td>
                      </tr>
                      <tr>
                        <td>Cost</td>
                        <td>{item.amount}</td>
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

export default ModalDetail;
