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
  return (
    <>
      <div className="serchBar">
        <input type="text" value={input} onChange={change} onKeyDown={enter} />
        <button onClick={addItem}> {editId !== null ? "Update" : "Add"} </button>
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
          {list.map((val) => (
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
