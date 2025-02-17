/**
 * import React, { useEffect, useState } from "react";
import { PHP_API_URL } from "../../site-components/Helper/Constant";
import { toast } from "react-toastify";
import {goBack} from "../../site-components/Helper/HelperFunction";
import { DeleteSweetAlert } from "../../site-components/Helper/DeleteSweetAlert";
import "../../../node_modules/primeicons/primeicons.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import secureLocalStorage from "react-secure-storage";
import "react-nestable/dist/styles/index.css"; // Import optional styling
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import '../../site-components/admin/assets/css/MenuList.css'
const ItemType = "MENU_ITEM";

// Draggable Item
const DraggableItem = ({ item, index, parentIndex, moveItem }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemType,
    item: { index, parentIndex },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag}
      style={{
        opacity: isDragging ? 0.5 : 1,
        padding: '8px',
        margin: '4px',
        backgroundColor: '#f0f0f0',
        borderRadius: '4px',
        cursor: 'move',
      }}
    >
      {item.name}
    </div>
  );
};

// Drop Zone for Nested Items
const DropZone = ({ children, index, parentIndex, moveItem }) => {
  const [, drop] = useDrop(() => ({
    accept: ItemType,
    hover: (item, monitor) => {
      if (item.index !== index || item.parentIndex !== parentIndex) {
        moveItem(item.index, index, item.parentIndex, parentIndex);
        item.index = index;
        item.parentIndex = parentIndex;
      }
    },
  }));

  return (
    <div
      ref={drop}
      style={{
        padding: '10px',
        minHeight: '50px',
        border: '1px dashed #ccc',
        marginBottom: '10px',
        background: '#f9f9f9',
      }}
    >
      {children}
    </div>
  );
};

// Recursive Menu Component
const NestedMenu = ({ items, parentIndex, moveItem }) => {
  return (
    <div style={{ paddingLeft: parentIndex * 20 + 'px' }}>
      {items.map((item, index) => (
        <DropZone
          key={index}
          index={index}
          parentIndex={parentIndex}
          moveItem={moveItem}
        >
          <DraggableItem
            item={item}
            index={index}
            parentIndex={parentIndex}
            moveItem={moveItem}
          />
          {item.children && item.children.length > 0 && (
            <NestedMenu
              items={item.children}
              parentIndex={parentIndex + 1}
              moveItem={moveItem}
            />
          )}
        </DropZone>
      ))}
    </div>
  );
};

// Main Drag-and-Drop Menu Component
const DragDropMenu = () => {
  const [items, setItems] = useState([
    { name: 'Home', children: [] },
    {
      name: 'About',
      children: [
        { name: 'Team', children: [] },
        {
          name: 'History',
          children: [
            { name: 'Founding', children: [] },
            { name: 'Expansion', children: [] },
          ],
        },
      ],
    },
    { name: 'Services', children: [] },
    { name: 'Contact', children: [] },
  ]);

  const moveItem = (fromIndex, toIndex, fromParentIndex, toParentIndex) => {
    const newItems = [...items];
    const fromItem = getItem(newItems, fromParentIndex, fromIndex);

    deleteItem(newItems, fromParentIndex, fromIndex);
    const toParentItem = getItem(newItems, toParentIndex, toIndex);
    toParentItem.children = toParentItem.children || [];
    toParentItem.children.splice(toIndex, 0, fromItem);

    setItems(newItems);
  };

  // Utility functions for item manipulation
  const getItem = (items, parentIndex, index) => {
    let item = items[index];
    for (let i = 0; i < parentIndex; i++) {
      item = item.children;
    }
    return item;
  };

  const deleteItem = (items, parentIndex, index) => {
    let parentItem = items;
    for (let i = 0; i < parentIndex; i++) {
      parentItem = parentItem.children;
    }
    parentItem.splice(index, 1);
  };

  return (
    <div style={{ width: '', margin: '0 auto' }}>
      <NestedMenu items={items} parentIndex={0} moveItem={moveItem} />
    </div>
  );
};

function MenuList() {
  const [MenuListing, setMenuListing] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const [recycleTitle, setRecycleTitle] = useState("Show Recycle Bin");
  const navigate = useNavigate();
  

  const fetchList = async (delete_status = 0) => {
    setIsFetching(true);
    try {
      const bformdata = new FormData();
      bformdata.append("data", "get_menu");
      bformdata.append("delete_status", delete_status);
      const response = await axios.post(`${PHP_API_URL}/menu.php`, bformdata);
      if (response.data.status === 200 && Array.isArray(response.data.data)) {
        setMenuListing(response.data.data);
      } else {
        toast.error("Invalid data structure received.");
      }
    } catch (error) {
      toast.error("Error fetching data.");
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    fetchList();
  }, []);
  const showRecyleBin = () => {
    setRecycleTitle(
      recycleTitle === "Show Recycle Bin"
        ? "Hide Recycle Bin"
        : "Show Recycle Bin"
    );
    fetchList(recycleTitle === "Show Recycle Bin" ? 1 : 0);
  };

  const handleToggleStatus = async (dbId) => {
    if (
      !dbId ||
      !Number.isInteger(parseInt(dbId, 10)) ||
      parseInt(dbId, 10) <= 0
    )
      return toast.error("Invalid ID.");
    try {
      const response = await axios.post(
        `${PHP_API_URL}/menu.php`,
        {
          id: dbId,
          data: "toggle_status",
          loguserid: secureLocalStorage.getItem("login_id"),
          login_type: secureLocalStorage.getItem("loginType"),
        },
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response.data.status === 200) {
        toast.success(response.data.msg);
        fetchList(0);
      } else {
        toast.error("An error occurred. Please try again.");
      }
    } catch (error) {
      const statusCode = error.response.data.status;

      if (statusCode === 400 || statusCode === 401 || statusCode === 500) {
        toast.error(error.response.data.msg || "A server error occurred.");
      } else {
        toast.error(
          "An error occurred. Please check your connection or try again."
        );
      }
    }
  };
  const deleteStatus = async (dbId) => {
    if (
      !dbId ||
      !Number.isInteger(parseInt(dbId, 10)) ||
      parseInt(dbId, 10) <= 0
    )
      return toast.error("Invalid ID.");
    try {
      const deleteAlert = await DeleteSweetAlert();
      if (deleteAlert) {
        const response = await axios.post(
          `${PHP_API_URL}/menu.php`,
          {
            id: dbId,
            data: "delete_page",
            loguserid: secureLocalStorage.getItem("login_id"),
            login_type: secureLocalStorage.getItem("loginType"),
          },
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        if (response.data?.status === 200) {
          toast.success(response.data.msg);
          if (response.data.data == 1) {
            fetchList(1);
          } else {
            fetchList(0);
          }
          showRecyleBin();
        } else {
          toast.error("An error occurred. Please try again.");
        }
      }
    } catch (error) {
      const statusCode = error.response?.data?.status;

      if (statusCode === 400 || statusCode === 401 || statusCode === 500) {
        toast.error(error.response?.data?.msg || "A server error occurred.");
      } else {
        toast.error(
          "An error occurred. Please check your connection or try again."
        );
      }
    }
  };
 

  return (
    <>
      <div className="page-container">
        <div className="main-content">
          <div className="container-fluid">
            <div className="page-header mb-0">
              <div className="header-sub-title">
                <nav className="breadcrumb breadcrumb-dash">
                  <Link to="/admin/home" className="breadcrumb-item">
                    <i className="fas fa-home m-r-5" />
                    Dashboard
                  </Link>
                  <span className="breadcrumb-item">CMS</span>
                  <span className="breadcrumb-item active">Menu</span>
                </nav>
              </div>
            </div>
            <div className="card bg-transparent mb-2">
              <div className="card-header d-flex justify-content-between align-items-center px-0">
                <h5 className="card-title h6_new">Menu List</h5>
                <div className="ml-auto">
                  <button
                    className="ml-auto btn-md btn border-0 btn-light mr-2"
                    onClick={() => goBack()}
                  >
                    <i className="fas fa-arrow-left" /> Go Back
                  </button>
                  <Link
                    to={"/admin/add-menu"}
                    className="ml-2 btn-md btn border-0 btn-primary"
                  >
                    <i className="fa-solid fa-floppy-disk mr-2"></i>Save Menu
                  </Link>
                  <Link
                    to={"/admin/add-menu"}
                    className="ml-2 btn-md btn border-0 btn-secondary"
                  >
                    <i className="fas fa-plus" /> Add New
                  </Link>
                </div>
              </div>
            </div>
            <div className="card">
              <div className="card-body">
                <DndProvider backend={HTML5Backend}>
                  <DragDropMenu />
                </DndProvider>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
export default MenuList;

 */