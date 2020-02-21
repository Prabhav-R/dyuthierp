
import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import firebase from 'firebase';

class ParticipantList extends Component {
  constructor(){
    super();
    this.state = {
        particpantsToShow: [],
        participants: []
    }
    this.getRegistration  = this.getRegistration.bind(this)
  }
  confirm_close = () => {
    if (
      window.confirm("Are you sure to close this event? This can't be undone")
    ) {
      this.props.history.push("/");
    }
  };
  getData(){
    const database = firebase.database();
    const { eid, eventname, username, posterUrl,  type} = this.props.event.event;
    console.log(this.props)
    console.log(eid);
    database.ref("/participants").once('value').then((snapshot)=>{
      const snaps = snapshot.val();
      console.log(snaps)
      this.setState({
        participants: snaps
      });
    }).then(()=>{
        // if( type == "Team"){
          
        // }else{
          
          database.ref("/event_participation").child('149363a0-220f-4731-8c86-5b96e226ebbf').once('value').then((snapshot)=>{
            const snaps = snapshot.val();
            console.log(snaps);
            let participants = [];
            let pList = [];
            for( let key in snaps){
              let p = snaps[key];
              let x = snaps[key];
              p = this.state.participants[p.uid];
              let obj = {dyuthi_id: p.dyuthi_id, name: p.name, mobile: p.mobile, college: p.college, is_paid: x.is_paid?true:false};
              pList.push(obj)
              participants.push(
                <ParticipantRow participant={obj} />
              )
            }
            this.setState({
              particpantsToShow: participants
            })
            console.log(pList);
          })
    });
    
  }
  componentDidMount(){
    this.getData();
  }
  getRegistration(eid){
    const database = firebase.database();
    database.ref("/event_participation").child(eid).once('value').then((snapshot)=>{
      const snaps = snapshot.val();
      console.log(snaps);
      let participants = [];
      let pList = [];
      for( let key in snaps){
        let p = snaps[key];
        p = this.state.participants[p.uid];
        pList.push({name: p.name, mobile: p.mobile, college: p.college, is_paid: p})
        participants.push(
          <ParticipantRow participant={p} />
        )
      }
      this.setState({
        particpantsToShow: participants
      })
      console.log(pList);
    })
  }
  render() {
    return (
      <div className="container mb-3">
        <div className="row mt-3">
          <div className="col-md-12">
            <h2>Participant List</h2>
          </div>
        </div>
        
        <span class="label label-info">{this.state.particpantsToShow.length} Participants</span>
        
        <div className="row mt-3 mb-3">
          <div className="col-md-12 page-header">
            {/* <span
              style={{
                width: "10px",
                height: "10px",
                background: "#34ed8e",
                border: "1px solid #d0d0d0",
                marginLeft: "20px"
              }}
            >
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{" "}
            </span>
            &nbsp;&nbsp;Reported */}
            <span
              style={{
                width: "10px",
                height: "10px",
                background: "#fff",
                border: "1px solid #d0d0d0",
                marginLeft: "20px"
              }}
            >
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{" "}
            </span>
            &nbsp;&nbsp;Not Paid
            <span
              style={{
                width: "10px",
                height: "10px",
                background: "#080",
                border: "1px solid #d0d0d0",
                marginLeft: "20px"
              }}
            >
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{" "}
            </span>
            &nbsp;&nbsp;Paid
          </div>
        </div>
        {/* <div className="row">
          <div className="col-md-12">
            <button
              type="button"
              className="mt-2 mr-1 btn btn-danger"
              onClick={this.confirm_close}
            >
              Close Registration
            </button>
            <a href="/erp/participants/download/">
              <button type="button" className="mt-2 ml-1 btn btn-info">
                Download Reported Participants Details
              </button>
            </a>
          </div>
        </div> */}
        <ul className="list-group mt-4 mb-3">
            {this.state.particpantsToShow}
        </ul> 
      </div>
    );
  }
}

const mapStateToProps = state => ({
  event: state.event,
  errors: state.errors
});

export default connect(mapStateToProps)(withRouter(ParticipantList));

function ParticipantRow(props){
  console.log(props)
  return (
    <li className={props.participant.is_paid? "list-group-item list-group-item-success": "list-group-item list-group-item-default"}>
      <div className="row">
        
        <div class="col-xs-3 col-sm-3 col-md-3 col-lg-3">
          {props.participant.dyuthi_id}
        </div>
        <div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">
          {props.participant.mobile}
          </div>
          <div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">
            {props.participant.name}
            </div>
      </div>
    </li>
  )
}



















// 145,225, 256