import React, { useState, useEffect } from 'react';
import './style.css';

export default function App() {
  const [data, setData] = useState();
  const [tableData, setTableData] = useState();
  const [search, setSearchText] = useState();

  const fetchData = () => {
    fetch('https://datausa.io/api/data?drilldowns=Nation&measures=Population')
      .then((res) => res.json())
      .then((res) => {
        res?.data?.length && setData([...res.data]);
        res?.data?.length && setTableData([...res.data]);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (search !== '' && tableData?.length > 0) {
      let timer = setTimeout(() => {
        const filteredData = tableData?.filter(
          (item) => item?.Year === search || item?.Population === search
        );
        setTableData([...filteredData]);
      }, 2000);
      return () => {
        clearTimeout(timer);
      };
    } else if (data?.length > 0) {
      setTableData([...data]);
    }
  }, [search]);

  const handleDeleteClick = (itemToDelete, deleteIndex) => {
    tableData?.splice(deleteIndex, 1);
    setTableData([...tableData]);
  };

  const handleReset = () => {
    setTableData([...data]);
  };
  return (
    <div className="container">
      <div>
        <label>
          Search &ensp;
          <input
            type="text"
            onChange={(e) => setSearchText(e?.target?.value)}
            value={search}
          />
        </label>
      </div>
      {tableData?.length > 0 && (
        <>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Population</th>
                <th>Nation</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {tableData?.map((item, index) => (
                <tr className="body-row" key={index}>
                  <td>{item?.Year}</td>
                  <td>{item?.Population}</td>
                  <td>{item?.Nation}</td>
                  <td>
                    <button
                      className="button-click"
                      onClick={() => handleDeleteClick(item, index)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button className="button-reset" onClick={handleReset}>
            Reset
          </button>
        </>
      )}
    </div>
  );
}
