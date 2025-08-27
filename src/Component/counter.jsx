import React, { useEffect, useState } from "react";

class Name {
  constructor(title) {
    this.id = diffId();
    this.title = title;
  }
}

let idCounter = 1;
const diffId = () => idCounter++;

function Counter() {
  const [input, setInput] = useState("");
  const [list, setIList] = useState([]);
  const [editId, setEditId] = useState(null);
  const [filteredList, setFilteredList] = useState([]);
  const [searchInput, setSearch] = useState("");
  const [showFiltered, setShowFiltered] = useState(false);

  const addItem = () => {
    if (input !== "") {
      if (editId !== null) {
        setIList((prev) =>
          prev.map((item) =>
            item.id === editId ? { ...item, title: input } : item
          )
        );
        setEditId(null);
      } else {
        const newItem = new Name(input);
        setIList((prev) => [...prev, newItem]);
      }
      setInput("");
    }
  };
  const change = (e) => {
    setInput(e.target.value);
  };

  const enter = (e) => {
    if (e.key === "Enter" && input !== "") {
      addItem();
    }
  };

  const searchEnter = (e) => {
    if (e.key === "Enter" && searchInput !== "") {
      searchList();
    }
  };

  useEffect(() => {
    console.log("Updated List:", list);
  }, [list]);

  useEffect(() => {
    const storage = localStorage.getItem("myData");
    if (storage) {
      const data = JSON.parse(storage);
      if (data.length > 0) {
        idCounter = Math.max(...data.map((e) => e.id)) + 1;
      }
      setIList(data);
    }
  }, []);

  useEffect(() => {
    if (list.length > 0) {
      localStorage.setItem("myData", JSON.stringify(list));
    }
  }, [list]);

  const Delete = (id) => {
    setIList((prev) => {
      const newArr = [...prev];
      const index = newArr.findIndex((item) => item.id === id);
      if (index !== -1) {
        newArr.splice(index, 1);
      }
      return newArr;
    });
  };

  const Edit = (id) => {
    const toEdit = list.find((item) => item.id === id);
    if (toEdit) {
      setInput(toEdit.title);
      setEditId(id);
    }
  };

  const clearAll = () => {
    localStorage.removeItem("myData");
    setIList([]);
    setInput("");
    setEditId(null);
    idCounter = 1;
  };

  const search = () => {
    if (searchInput.trim() === "") {
      setFilteredList(list);
      return;
    }

    const results = list.filter((item) =>
      item.title.toLowerCase().includes(searchInput.trim().toLowerCase())
    );

    if (results.length === 0) {
      alert("Does not exist");
    }

    setFilteredList(results);
  };

  const searchList = () => {
    if (showFiltered) {
      setShowFiltered(false);
      setFilteredList([]);
      setSearch('')
    } else {
      search();
      setShowFiltered(true);
    }
  };

  return (
    <>
      <div className="searchBar">
        <input type="text" value={input} onChange={change} onKeyDown={enter} />
        <button onClick={addItem}> {editId !== null ? "Update" : "Add"}</button>
        <button
          onClick={clearAll}
          style={{
            marginLeft: "10px",
            color: "red",
            fontSize: "10px",
            width: "130px",
            fontWeight: "bold",
          }}
        >
          Clear All
        </button>
      </div>

      <div className="searchBar search">
        <input
          type="text"
          value={searchInput}
          onKeyDown={searchEnter}
          onChange={(e) => setSearch(e.target.value)}
        />

        <button
          onClick={searchList}
          style={{
            marginLeft: "10px",
            fontSize: "15px",
            width: "130px",
            fontWeight: "bold",
          }}
        >
          {showFiltered ? "Show List" : "Search"}
        </button>
      </div>
      <h4>All Entered Values:</h4>

      <table className="table">
        <thead>
          <tr>
            <th>id</th>
            <th>Title</th>
          </tr>
        </thead>

        <tbody>
          {(showFiltered ? filteredList : list).map((val) => (
            <tr key={val.id} className="tr">
              <td className="id">{val.id}</td>
              <td className="title">
                <span>{val.title} </span>
                <div className="btn">
                  <span className="edit" onClick={() => Edit(val.id)}>
                    Edit
                  </span>
                  <span className="delete" onClick={() => Delete(val.id)}>
                    Delete
                  </span>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

export default Counter;
