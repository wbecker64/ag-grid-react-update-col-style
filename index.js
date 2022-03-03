import React, { useState, useRef, useEffect } from 'react';
import { render } from 'react-dom';
import { AgGridReact } from 'ag-grid-react';

import 'ag-grid-enterprise';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';

const onGridReady = (params, setRowData, apiRef) => {
  apiRef.current = params.api;

  const httpRequest = new XMLHttpRequest();
  const updateData = (data) => {
    data.length = 10;
    data = data.map((row, index) => {
      return { ...row, id: index + 1 };
    });
    setRowData(data);
  };

  httpRequest.open(
    'GET',
    'https://raw.githubusercontent.com/ag-grid/ag-grid/master/grid-packages/ag-grid-docs/src/olympicWinnersSmall.json'
  );
  httpRequest.send();
  httpRequest.onreadystatechange = () => {
    if (httpRequest.readyState === 4 && httpRequest.status === 200) {
      updateData(JSON.parse(httpRequest.responseText));
    }
  };
};

const getColor = () => {
  return '#' + Math.floor(Math.random() * 16777215).toString(16);
};

const App = () => {
  const apiRef = useRef();
  const [rowData, setRowData] = useState();
  const [color, setColor] = useState('blue');
  useEffect(() => {
    if (apiRef.current) {
      apiRef.current.refreshCells({ force: true });
    }
  }, [color]);

  const colDefs = [
    {
      field: 'athlete',
      minWidth: 150,
      cellStyle: { color: color },
    },
  ];

  return (
    <div style={{ width: '600px', height: '600px' }}>
      <button
        onClick={() => {
          setColor(getColor());
        }}
      >
        Update Col style
      </button>
      <div
        id="myGrid"
        style={{
          height: '100%',
          width: '100%',
        }}
        className="ag-theme-alpine"
      >
        <AgGridReact
          getRowNodeId={(data) => {
            return data.id;
          }}
          columnDefs={colDefs}
          defaultColDef={{
            flex: 1,
            minWidth: 100,
          }}
          rowSelection={'single'}
          onGridReady={(params) => onGridReady(params, setRowData, apiRef)}
          immutableData={true}
          rowData={rowData}
        />
      </div>
    </div>
  );
};

render(<App />, document.getElementById('root'));
