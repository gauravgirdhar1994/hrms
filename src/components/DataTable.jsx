import React from 'react';
import $ from 'jquery';
import 'datatables.net';
import '../../node_modules/datatables.net-bs4/css/dataTables.bootstrap4.min.css';
import '../../node_modules/datatables.net-bs4/js/dataTables.bootstrap4.min.js';

const columns = [
    { data: "name", orderable:true  },
    { data: "position", orderable:true  },
    { data: "salary", orderable:true  },
    { data: "start_date", orderable:true  },
    { data: "office", orderable:true  },
    { data: "ext", orderable:true  }
];

const tableData = [
    {
    "name": "Tiger Nixon",
    "position": "System Architect",
    "salary": "$260,800",
    "start_date": "2011/04/25",
    "office": "Edinburgh",
    "ext": "5421"
    },
    {
    "name": "Fooger McAllister",
    "position": "CTO",
    "salary": "$210,600",
    "start_date": "2017/12/13",
    "office": "Springfield",
    "ext": "2401"
    },
    {
    "name": "Trey Brown",
    "position": "System Engineer",
    "salary": "$120,000",
    "start_date": "2014/03/20",
    "office": "Dublin",
    "ext": "1411"
    },
    {
    "name": "Mark Amber",
    "position": "System Engineer",
    "salary": "$118,000",
    "start_date": "2014/02/20",
    "office": "Boston",
    "ext": "1411"
    },
    {
    "name": "Wilson Brown",
    "position": "System Engineer",
    "salary": "$120,000",
    "start_date": "2014/03/20",
    "office": "Newport",
    "ext": "5422"
    },
    {
    "name": "Michael Skelly",
    "position": "System Engineer",
    "salary": "$125,000",
    "start_date": "2014/03/20",
    "office": "Dublin",
    "ext": "4411"
    },
    {
    "name": "Shaun McAllister",
    "position": "COO",
    "salary": "$240,600",
    "start_date": "2017/12/13",
    "office": "Springfield",
    "ext": "1401"
    },
    {
    "name": "Brandi Stevens",
    "position": "CEO",
    "salary": "$325,000",
    "start_date": "2013/03/20",
    "office": "Boston",
    "ext": "1011"
    },
    {
    "name": "Mary Jones",
    "position": "Office Staff",
    "salary": "$95,000",
    "start_date": "2015/03/20",
    "office": "Boston",
    "ext": "1092"
    },
    {
    "name": "Andrew Skelly",
    "position": "System Engineer",
    "salary": "$125,000",
    "start_date": "2014/03/20",
    "office": "Dublin",
    "ext": "4411"
    },
    {
    "name": "Karen Richards",
    "position": "Architect",
    "salary": "$230,800",
    "start_date": "2011/04/25",
    "office": "Boston",
    "ext": "1021"
    }
];

class DataTable extends React.Component{

    componentDidMount() {
        setTimeout(
          () => this.tick(),
          500
        );
    }  
    
    tick() {
        // init and load DataTable
        $(this.refs.main).DataTable({
            dom: '<"table-responsive-md"<"float-left"f><"float-right"l>t<"row align-items-end"<"col"i><"col pt-3"p>>>',
            data: this.props.data||tableData,
            columns,
            ordering: true,
            order: [[0, "asc"]]
        });
     }
    
    componentWillUnmount(){
        $('.dataTables_wrapper')
        .find('table')
        .DataTable()
        .destroy(true);
    }

    render() {
        return (
            <table className="table table-hover table-striped" ref="main">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Title</th>
                        <th>Salary</th>
                        <th>Started</th>
                        <th>Office</th>
                        <th>Ext</th>
                    </tr>
                </thead>
                <tbody />
            </table>
        );
    }

}

export default DataTable;
