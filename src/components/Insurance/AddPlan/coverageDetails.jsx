/* eslint-disable */
import React, { Component } from "react";
import { Col, Card, Row, Table } from "reactstrap";
import config from "../../../config/config";
import { Modal, Form, Button } from "react-bootstrap";
import "react-toastify/dist/ReactToastify.css";
import "react-toastify/dist/ReactToastify.css";
// import loader from "../../loader.gif";
import { FaEdit, FaTrash } from "react-icons/fa";
import axios from "axios";
//import Moment from "moment";
import { Progress } from "reactstrap";
import { ToastContainer, toast } from "react-toastify";
import { CSVLink } from "react-csv";
const BEARER_TOKEN = localStorage.getItem("userData");
class CoverageDetails extends Component {
	constructor(props) {
		super(props);
		this.state = {
			show: false,
			planId: props.planId,
			formData: [],
			mappingList: [],
			loading: false,
			dataLoading: false,
			networkDataLoading: false,
			coverageList: [],
			deductibleList: [],
			tpaList: [],
			copayList: [],
			networkList: [],
			benefitDet: {},
			benefitPremiums: [],
			selectfile: null,
			id: 0,
			fields: [
				{
					coverageId: "Territorial Limit",
					dedutableId: "Deductible",
					copayId: "Copay",
					tpaId: "TPA",
					networkId: "Network",
					benefit: "Benefit Name",
					terretorialLimit: "Max Annual Limit for P&C",
					copayOnOp: "Copay on OP",
					copayOnIp: "Copay on IP",
					copayOnPharmacy: "Copay and limit on Pharmacy",
					waitingPeriod: "P & C waiting period",
				},
			],
			validateFields: {},
		};
		this.changeHander = this.changeHander.bind(this);
	}

	componentDidMount() {
		this.getMappingDetailList();
		this.getPopUpDetailList();
	}
	getPopUpDetailList() {
		var bearer = "Bearer " + BEARER_TOKEN;
		const options = {
			method: "GET",
			headers: {
				Authorization: bearer,
			},
		};
		this.setState({
			dataLoading: true,
		});
		//   fetch(BaseURL, options)
		fetch(config.API_URL + "/insurance/plan/master-data", options)
			.then((res) => res.json())
			.then((res) => {
				if (res.success) {
					this.setState({
						coverageList: res.planMasterData.coverage,
						deductibleList: res.planMasterData.deductible,
						tpaList: res.planMasterData.tpa,
						copayList: res.planMasterData.copay,
						dataLoading: false,
					});
				}
			})
			.catch((error) => {
				console.log(error);
			});
	}

	checkMimeType = (event) => {
		//getting file object
		let files = event.target.files;
		//define message container
		let err = [];
		// list allow mime type
		const types = [
			"text/csv",
			"application/vnd.ms-excel",
			"text/x-csv",
			"text/plain",
		];
		// loop access array
		for (var x = 0; x < files.length; x++) {
			// compare file type find doesn't matach
			if (types.every((type) => files[x].type !== type)) {
				// create error message and assign to container
				err[x] = files[x].type + " is not a supported format\n";
			}
		}
		for (var z = 0; z < err.length; z++) {
			// if message not same old that mean has error
			// discard selected file
			toast.error(err[z]);
			event.target.value = null;
		}
		return true;
	};

	maxSelectFile = (event) => {
		let files = event.target.files;
		if (files.length > 1) {
			const msg = "Only 1 can be uploaded at a time";
			event.target.value = null;
			toast.warn(msg);
			return false;
		}
		return true;
	};
	checkFileSize = (event) => {
		let files = event.target.files;
		let size = 5000000;
		let err = [];
		for (var x = 0; x < files.length; x++) {
			if (files[x].size > size) {
				err[x] = files[x].type + "is too large, please pick a smaller file\n";
			}
		}
		for (var z = 0; z < err.length; z++) {
			// if message not same old that mean has error
			// discard selected file
			toast.error(err[z]);
			event.target.value = null;
		}
		return true;
	};
	onChangeHandler = (event) => {
		var files = event.target.files;
		console.log(this.maxSelectFile(event));
		console.log(this.checkMimeType(event));
		console.log(this.checkFileSize(event));
		if (
			this.maxSelectFile(event) &&
			this.checkMimeType(event) &&
			this.checkFileSize(event)
		) {
			// if return true allow to setState
			this.setState({
				selectfile: files,
				loaded: 0,
			});
			console.log(this.state.selectfile);
		}
	};

	getMappingDetailList() {
		var bearer = "Bearer " + BEARER_TOKEN;
		const options = {
			method: "GET",
			headers: {
				Authorization: bearer,
			},
		};
		this.setState({
			loading: true,
		});
		//   fetch(BaseURL, options)
		fetch(
			config.API_URL +
			"/insurance/plan/list-coverage-deductible/" +
			this.state.planId,
			options
		)
			.then((res) => res.json())
			.then((res) => {
				if (res.success) {
					this.setState({
						mappingList: res.covMapList,
						loading: false,
						show: false,
					});
				}
			})
			.catch((error) => {
				console.log(error);
			});
	}
	getNetworklistByTpa(tpa) {
		var bearer = "Bearer " + BEARER_TOKEN;
		const options = {
			method: "GET",
			headers: {
				Authorization: bearer,
			},
		};
		this.setState({
			networkDataLoading: true,
		});
		fetch(
			config.API_URL + "/insurance/plan/master-data/networks/" + tpa,
			options
		)
			.then((res) => res.json())
			.then((res) => {
				if (res.success) {
					this.setState({
						networkList: res.networkList,
						networkDataLoading: false,
					});
				}
			})
			.catch((error) => {
				console.log(error);
			});
	}
	getParams(param, value) {
		let allParam = {};
		if (param == "coverage") {
			allParam.coverage = value;
			allParam.deductible = this.state.formData.deductible;
			allParam.copay = this.state.formData.copay;
			allParam.network = this.state.formData.network;
		} else if (param == "deductible") {
			allParam.coverage = this.state.formData.coverage;
			allParam.deductible = value;
			allParam.copay = this.state.formData.copay;
			allParam.network = this.state.formData.network;
		} else if (param == "copay") {
			allParam.coverage = this.state.formData.coverage;
			allParam.deductible = this.state.formData.deductible;
			allParam.copay = value;
			allParam.network = this.state.formData.network;
		} else if (param == "network") {
			allParam.coverage = this.state.formData.coverage;
			allParam.deductible = this.state.formData.deductible;
			allParam.copay = this.state.formData.copay;
			allParam.network = value;
		}
		return allParam;
	}
	getBenefit(param, value) {
		const allParam = this.getParams(param, value);
		if (
			allParam.coverage &&
			allParam.deductible &&
			allParam.copay &&
			allParam.network
		) {
			var bearer = "Bearer " + BEARER_TOKEN;
			/* const options = {
					  method: 'GET',
					  body: JSON.stringify(allParam),
					  headers: {
						  'Authorization': bearer
					  }
				  }; */
			/*  this.setState({
					   dataLoading: true
				   })
				  */
			axios
				.post(
					config.API_URL + "/insurance/plan/master-data/benefit",
					allParam,
					{
						headers: {
							Authorization: bearer,
						},
					}
				)
				.then((res) => {
					if (res.data.success) {
						let benefitDet =
							res.data.benefitDet.length > 0 ? res.data.benefitDet[0] : {};
						let { benefitId, benefitName } = "";
						if (benefitDet) {
							benefitId = benefitDet.id;
							benefitName = benefitDet.value;
						}
						this.setState({
							formData: {
								...this.state.formData,
								benefit: benefitName,
								benefitId: benefitId,
							},
						});
					} else {
						alert(res.data.message);
					}
				})
				.catch((error) => {
					console.log("ALLOW ===> ", error);
				});
		}
	}
	handleClose = () => {
		this.setState({ show: false });
	};
	onShowModal = () => {
		this.setState({ show: true });
	};
	changeHander = (e) => {
		this.setState({
			formData: {
				...this.state.formData,
				[e.target.name]: e.target.value,
			},
		});
		console.log("this.state.formData ===> ", this.state.formData);
		console.log("target name ===> ", e.target.name);

		if (e.target.name == "tpaId") {
			this.getNetworklistByTpa(e.target.value);
		}
	};
	handleSubmit = (e) => {
		e.preventDefault();
		const data = new FormData();
		if (this.state.selectfile) {
			data.append("premiumSheet", this.state.selectfile[0]);
		}
		data.append("coverageId", this.state.formData.coverageId);
		data.append("deductableId", this.state.formData.dedutableId);
		data.append("copayId", this.state.formData.copayId);
		data.append("categoryId", this.state.formData.tpaId);
		data.append("networkId", this.state.formData.networkId);
		data.append("id", this.state.id);
		data.append("terretorialLimit", this.state.formData.terretorialLimit);
		data.append("copayOnOp", this.state.formData.copayOnOp);
		data.append("copayOnIp", this.state.formData.copayOnIp);
		data.append("copayOnPharmacy", this.state.formData.copayOnPharmacy);
		data.append("waitingPeriod", this.state.formData.waitingPeriod);
		data.append("benifit", this.state.formData.benefit);
		data.append("planId", this.state.planId);
		data.append("tpaId", this.state.formData.tpaId);
		console.log("dataaa", data);

		var bearer = "Bearer " + BEARER_TOKEN;

		const options = {
			method: "POST",
			headers: {
				Authorization: bearer,
			},
			body: data,
		};
		console.log("options", options);
		if (this.validateForm()) {
			fetch(config.API_URL + "/insurance/add-benifit-data", options)
				.then((res) => res.json())
				.then((res) => {
					if (res.status) {
						this.getMappingDetailList();
						this.setState({
							formData: [],
						});
					} else {
						alert(res.message);
					}
				})
				.catch((error) => {
					console.log("ALLOW ===> ", error);
				});
		}
	};
	loadList() {
		if (!this.state.loading) {
			if (this.state.mappingList.length > 0) {
				let sno = 1;
				return this.state.mappingList.map((list) => {
					return (
						<tr>
							<td>{sno++}</td>
							<td>{list.name}</td>
							<td>{list.coverage}</td>
							<td>{list.deductible}</td>
							<td>{list.copay}</td>
							<td>{list.networkName}</td>
							<td>
								<input
									type="reset"
									data={list.id}
									className="btn btn-primary mr-2"
									onClick={() => this.onDeductableEdit(list.id)}
									value="Edit"
								/>
							</td>
						</tr>
					);
				});
			} else {
				return (
					<tr>
						<td>No Record Found</td>
					</tr>
				);
			}
		} else {
			return (
				<tr>
					<td>Loading</td>
				</tr>
			);
		}
	}

	onDeductableEdit(id) {
		var bearer = "Bearer " + BEARER_TOKEN;
		axios
			.get(config.API_URL + "/insurance/plan/coverage-benefit/edit/" + id, {
				headers: {
					Authorization: bearer,
				},
			})
			.then((res) => {
				console.log("res.data", res.data);
				if (res.data.success) {
					let benefitDet = res.data.benefitDet;
					benefitDet.benefit = benefitDet.name;
					let networkList = res.data.networkList;
					let benefitPremiums = res.data.benefitPremiums;

					this.setState({
						id: id,
						formData: benefitDet,
						networkList: networkList,
						benefitPremiums: benefitPremiums,
						show: true,
					});
				} else {
					alert(res.data.message);
				}
			})
			.catch((error) => {
				console.log("ALLOW ===> ", error);
			});
		/* this.onShowModal();
			this.state.mappingList.map(list => {
				if(id === list.id){
					this.setState({
						id:id,
						formData:list
					});
				}
			}); */
	}

	populateList(listType, selectedValue = "") {
		let list = "";
		let arrayList = [];
		if (listType === "coverageList") {
			arrayList = this.state.coverageList;
		} else if (listType === "deductibleList") {
			arrayList = this.state.deductibleList;
		} else if (listType === "copayList") {
			arrayList = this.state.copayList;
		} else if (listType === "tpaList") {
			arrayList = this.state.tpaList;
		}
		if (arrayList.length > 0) {
			list = arrayList.map((obj) => {
				return (
					<option
						value={obj.id}
						selected={selectedValue == obj.id ? true : false}
					>
						{obj.value}
					</option>
				);
			});
		}
		return list;
	}
	networkList() {
		console.log("network list", this.state.networkList);
		let list = "";
		if (!this.state.networkDataLoading) {
			if (this.state.networkList.length > 0) {
				list = this.state.networkList.map((obj) => {
					return (
						<option
							value={obj.id}
							selected={this.state.formData.networkId == obj.id ? true : false}
						>
							{obj.value}
						</option>
					);
				});
			}
		}
		return list;
	}
	validateForm() {
		let fields = this.state.fields[0];
		let validations = {};
		let isFormValid = true;
		if (fields) {
			console.log("Payroll Fields", fields);
			for (var key in fields) {
				if (
					this.state.formData[key] == "" ||
					typeof this.state.formData[key] == "undefined"
				) {
					validations[key] = fields[key];
					isFormValid = false;
				}
			}
			console.log("validations ============> ", validations);
			this.setState({ validateFields: validations });
			return isFormValid;
		}
	}
	render() {
		// console.log('props ====> ', this.state.covMapList);
		const formData = this.state.formData;
		console.log("formData ======> ", this.state);
		const headersData = [
			{ label: "minAge", key: "minAge" },
			{ label: "maxAge", key: "maxAge" },
			{ label: "amount", key: "amount" },
			{ label: "gender", key: "gender" },
			{ label: "status", key: "status" },
		];

		const dataData = this.state.benefitPremiums;
		return (
			<>
				<Card className="card topFilter d-block pl-4 pr-4 pt-3 pb-3 br-3 mb-1  shadow-sm">
					<h4>Add Coverage & Deductible</h4>

					<Table className="leaveTable">
						<thead>
							<tr>
								<th>S.No.</th>
								<th>Benefit</th>
								<th>Coverage</th>
								<th>Deductible</th>
								<th>Co-Pay</th>
								<th>Networks</th>
								<th>Action</th>
							</tr>
						</thead>
						<tbody>{this.loadList()}</tbody>
					</Table>
				</Card>

				<div
					ref={this.props.myRef}
					onClick={this.onShowModal}
					class="form-group row pt-2 mb-5 "
				>
					<div class="col-lg-12 text-left">
						<span class="addNewButton">
							{" "}
							<i class="icon-plus icons"></i> Add New
						</span>
					</div>
				</div>

				<Modal show={this.state.show} onHide={this.handleClose}>
					<Modal.Header closeButton>
						<Modal.Title>Add Coverage & Deductible</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<Form onSubmit={this.handleSubmit}>
							<Row>
								<div class="col-sm-6 pb-3">
									<div class="row">
										<div class="col-sm-4">
											<label for="ticket_type">
												Territorial Limit <span className="text-danger">*</span>
											</label>
										</div>
										<div class="col-sm-8">
											<select
												className="form-control custom-select"
												id="coverage"
												name="coverageId"
												onChange={this.changeHander}
											>
												<option value="">Select Territorial Limit</option>
												{this.populateList(
													"coverageList",
													this.state.formData.coverageId
												)}
											</select>
											<div class="errMsg">
												{this.state.validateFields["coverageId"] ? 'Please select the ' + this.state.validateFields["coverageId"] : ""}
											</div>
										</div>
									</div>
								</div>
								<div class="col-sm-6 pb-3">
									<div class="row">
										<div class="col-sm-4">
											<label for="ticket_type">
												Deductible <span className="text-danger">*</span>
											</label>
										</div>
										<div class="col-sm-8">
											<select
												className="form-control custom-select"
												id="deductible"
												name="dedutableId"
												onChange={this.changeHander}
											>
												<option value="">Select Deductible</option>
												{this.populateList(
													"deductibleList",
													this.state.formData.dedutableId
												)}
											</select>
											<div class="errMsg">
												{this.state.validateFields["dedutableId"] ? "Please select the " + this.state.validateFields["dedutableId"] : ""}
											</div>
										</div>
									</div>
								</div>
								<div class="col-sm-6 pb-3">
									<div class="row">
										<div class="col-sm-4">
											<label for="ticket_type">
												Copay <span className="text-danger">*</span>
											</label>
										</div>
										<div class="col-sm-8">
											<select
												className="form-control custom-select"
												id="copay"
												name="copayId"
												onChange={this.changeHander}
											>
												<option value="">Select Copay</option>
												{this.populateList(
													"copayList",
													this.state.formData.copayId
												)}
											</select>
											{/* <input
												type="text"
												name="copay"
												className="form-control"
												onChange={this.changeHander}
												value={this.state.formData.copayId}
											/> */}
											<div class="errMsg">
												{this.state.validateFields["copayId"] ? "Please select the " + this.state.validateFields["copayId"] : ""}
											</div>
										</div>
									</div>
								</div>
								<div class="col-sm-6 pb-3">
									<div class="row">
										<div class="col-sm-4">
											<label for="ticket_type">
												TPA <span className="text-danger">*</span>
											</label>
										</div>
										<div class="col-sm-8">
											<select
												id="tpa"
												name="tpaId"
												className="form-control custom-select"
												onChange={this.changeHander}
											>
												<option value="">Select TPA</option>
												{this.populateList(
													"tpaList",
													this.state.formData.tpaId
												)}
											</select>
											<div class="errMsg">
												{this.state.validateFields["tpaId"] ? "Please select the " + this.state.validateFields["tpaId"] : ""}
											</div>
										</div>
									</div>
								</div>
								<div class="col-sm-6 pb-3">
									<div class="row">
										<div class="col-sm-4">
											<label for="ticket_type">
												Network <span className="text-danger">*</span>
											</label>
										</div>
										<div class="col-sm-8">
											<select
												className="form-control"
												id="network"
												name="networkId"
												onChange={this.changeHander}
												value={this.state.formData.network}
											>
												<option value="">Select Network</option>
												{this.networkList()}
											</select>
											<div class="errMsg">
												{this.state.validateFields["networkId"] ? "Please select the " + this.state.validateFields["networkId"] : ""}
											</div>
										</div>
									</div>
								</div>
								<div class="col-sm-6 pb-3">
									<div class="row">
										<div class="col-sm-4">
											<label for="ticket_type">
												Benefit Name <span className="text-danger">*</span>
											</label>
										</div>
										<div class="col-sm-8">
											<input
												type="text"
												name="benefit"
												className="form-control"
												onChange={this.changeHander}
												value={this.state.formData.benefit}
											/>
											<div class="errMsg">
												{this.state.validateFields["benefit"] ? "Please enter the " + this.state.validateFields['benefit'] : ""}
											</div>
										</div>
									</div>
								</div>
								<div class="col-sm-6 pb-3">
									<div class="row">
										<div class="col-sm-4">
											<label for="ticket_type">
												Max Annual Limit for P&C <span className="text-danger">*</span>
											</label>
										</div>
										<div class="col-sm-8">
											<input
												type="text"
												name="terretorialLimit"
												className="form-control"
												onChange={this.changeHander}
												value={this.state.formData.terretorialLimit}
											/>
											<div class="errMsg">
												{this.state.validateFields["terretorialLimit"] ? "Please enter the " + this.state.validateFields["terretorialLimit"] : ""}
											</div>
										</div>
									</div>
								</div>

								<div class="col-sm-6 pb-3">
									<div class="row">
										<div class="col-sm-4">
											<label for="ticket_type">
												Copay on OP <span className="text-danger">*</span>
											</label>
										</div>
										<div class="col-sm-8">
											<input
												type="text"
												name="copayOnOp"
												className="form-control"
												onChange={this.changeHander}
												value={this.state.formData.copayOnOp}
											/>
											<div class="errMsg">
												{this.state.validateFields["copayOnOp"] ? "Please enter the " + this.state.validateFields["copayOnOp"] : ""}
											</div>
										</div>
									</div>
								</div>

								<div class="col-sm-6 pb-3">
									<div class="row">
										<div class="col-sm-4">
											<label for="ticket_type">
												Copay ON IP <span className="text-danger">*</span>
											</label>
										</div>
										<div class="col-sm-8">
											<input
												type="text"
												name="copayOnIp"
												className="form-control"
												onChange={this.changeHander}
												value={this.state.formData.copayOnIp}
											/>
											<div class="errMsg">
												{this.state.validateFields["copayOnIp"] ? "Please enter the " + this.state.validateFields["copayOnIp"] : ""}
											</div>
										</div>
									</div>
								</div>

								<div class="col-sm-6 pb-3">
									<div class="row">
										<div class="col-sm-4">
											<label for="ticket_type">
												Copay and limit on Pharmacy{" "}
												<span className="text-danger">*</span>{" "}
											</label>
										</div>
										<div class="col-sm-8">
											<input
												type="text"
												name="copayOnPharmacy"
												className="form-control"
												onChange={this.changeHander}
												value={this.state.formData.copayOnPharmacy}
											/>
											<div class="errMsg">
												{this.state.validateFields["copayOnPharmacy"] ? "Please enter the " + this.state.validateFields["copayOnPharmacy"] : ""}
											</div>
										</div>
									</div>
								</div>

								<div class="col-sm-6 pb-3">
									<div class="row">
										<div class="col-sm-4">
											<label for="ticket_type">
												P & C waiting period{" "}
												<span className="text-danger">*</span>
											</label>
										</div>
										<div class="col-sm-8">
											<input
												type="text"
												name="waitingPeriod"
												className="form-control"
												onChange={this.changeHander}
												value={this.state.formData.waitingPeriod}
											/>
											<div class="errMsg">
												{this.state.validateFields["waitingPeriod"] ? "Please enter the " + this.state.validateFields["waitingPeriod"] : ""}
											</div>
										</div>
									</div>
								</div>
								{/* 
				<div class="col-sm-6 pb-3">
				  <div class="row">
					<div class="col-sm-4">
					  <label for="priority">
						Premium Sheet <span className="text-danger">*</span>
					  </label>
					</div>
					<div class="col-sm-8">

					  <input
						type="file"
						className="custom-input-file"
						
						onChange={this.onChangeHandler}
					  />
					 
					</div>
				  </div>
				  {dataData.length > 0 && (
					<div className="row">
					  <CSVLink
						data={dataData}
						headers={headersData}
						filename={"premium-sheet.csv"}
						className="btn btn-success"
						target="_blank"
					  >
						Download Premium Sheet
					  </CSVLink>
					</div>
				  )}
				</div> */}
							</Row>

							<div className="col-sm-12 pb-3">
								<Button
									variant="secondary"
									className="mr-2"
									type="reset"
									onClick={this.handleClose}
								>
									Cancel
								</Button>
								<Button
									variant="primary"
									type="submit"
									onClick={this.handleSubmit}
								>
									Save
								</Button>
							</div>
						</Form>
					</Modal.Body>
				</Modal>
			</>
		);
	}
}

export default CoverageDetails;
