import React, { useEffect, useState } from "react";
import "antd/dist/antd.css";
import "../index.css";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { doNotGetData } from "../../../constants/doNotGetData";
import { getStaff, updateActiveAcc, updateIsLogin } from "../../../api/auth";
import { getColumnSearchProps } from "../../../constants/getColumnSearchProps";
import {
  Tooltip,
  Table,
  notification,
  Switch,
  Drawer,
  Divider,
  Button,
  Popconfirm,
} from "antd";
import { ReloadOutlined } from "@ant-design/icons";
import Cookies from "js-cookie";
import { insertStaffList } from "../../../store/reducers/staffList";
import { AddStaff } from "./AddStaff";
import { DrawerStaff } from "./DrawerStaff";
import { ExportReactCSV } from "../../../constants/ExportReactCSV ";

const ListOfStaffs = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const reduxStaffList = useSelector((state) => state.staffList.StaffList);
  const initialState = {
    staffList: reduxStaffList,
    staff: null,
    drawerVisible: false,
    total: null,
  };
  const token = Cookies.get("token");

  const [state, setState] = useState(initialState);

  const fetchDataGetStaff = async () => {
    const res = await getStaff(token);
    if (!res) {
      doNotGetData();
    }
    if (res) {
      if (res.success) {
        const newStaffList = res.data.map((item, index) => {
          const key = index;
          return { ...item, key };
        });
        dispatch(insertStaffList({ newStaffList }));
        setState((prev) => ({
          ...prev,
          staffList: newStaffList,
        }));
      }
      if (!res.success) {
        if (res.message === "Token is expired") {
          Cookies.remove("token", { path: "/" });
          notification["warning"]({
            message: "Warning: get staff",
            description: `${res.message}`,
          });
          history.push("/account/sign-in/reload");
        }
        if (typeof res.message === "object") {
          const message = Object.keys(res.message).map((key) => {
            return res.message[key];
          });
          notification["warning"]({
            message: "Warning: get staff",
            description: `${message}`,
          });
        } else {
          notification["warning"]({
            message: "Warning: get staff",
            description: `${res.message}`,
          });
        }
      }
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const res = await getStaff(token);
      if (!res) {
        doNotGetData();
      }
      if (res) {
        if (res.success) {
          const newStaffList = res.data.map((item, index) => {
            const key = index;
            return { ...item, key };
          });
          dispatch(insertStaffList({ newStaffList }));
          setState((prev) => ({
            ...prev,
            staffList: newStaffList,
          }));
        }
        if (!res.success) {
          if (res.message === "Token is expired") {
            Cookies.remove("token", { path: "/" });
            notification["warning"]({
              message: "Warning: get staff",
              description: `${res.message}`,
            });
            history.push("/account/sign-in/reload");
          }
          if (typeof res.message === "object") {
            const message = Object.keys(res.message).map((key) => {
              return res.message[key];
            });
            notification["warning"]({
              message: "Warning: get staff",
              description: `${message}`,
            });
          } else {
            notification["warning"]({
              message: "Warning: get staff",
              description: `${res.message}`,
            });
          }
        }
      }
    };
    if (
      reduxStaffList.length === 0 ||
      state.staffList.length !== reduxStaffList.length
    ) {
      fetchData();
    }
  }, [dispatch, history, token, reduxStaffList, state.staffList.length]);

  const confirmIsActive = async (record) => {
    const res = await updateActiveAcc(record.userName, !record.isActive, token);

    if (res && res.success) {
      fetchDataGetStaff();

      notification["success"]({
        message: "Successfully",
        description: `${res.data}`,
      });
    }
    if (res && !res.success) {
      if (res.message === "Token is expired") {
        Cookies.remove("token", { path: "/" });
        notification["warning"]({
          message: "Warning: confirm IsActive",
          description: `${res.message}`,
        });
        history.push("/account/sign-in/reload");
      }
      if (typeof res.message === "object") {
        const message = Object.keys(res.message).map((key) => {
          return res.message[key];
        });
        notification["warning"]({
          message: "Warning: confirm IsActive",
          description: `${message}`,
        });
      } else {
        notification["warning"]({
          message: "Warning: confirm IsActive",
          description: `${res.message}`,
        });
      }
    }
  };

  const confirmIsLogin = async (record) => {
    const res = await updateIsLogin(record.userName, !record.isLogin, token);

    if (res && res.success) {
      fetchDataGetStaff();

      notification["success"]({
        message: "Successfully",
        description: `${res.data}`,
      });
    }
    if (res && !res.success) {
      if (res.message === "Token is expired") {
        Cookies.remove("token", { path: "/" });
        notification["warning"]({
          message: "Warning: confirm IsActive",
          description: `${res.message}`,
        });
        history.push("/account/sign-in/reload");
      }
      if (typeof res.message === "object") {
        const message = Object.keys(res.message).map((key) => {
          return res.message[key];
        });
        notification["warning"]({
          message: "Warning: confirm IsActive",
          description: `${message}`,
        });
      } else {
        notification["warning"]({
          message: "Warning: confirm IsActive",
          description: `${res.message}`,
        });
      }
    }
  };

  const onClickStaff = (record) => {
    setState((prev) => ({
      ...prev,
      staff: record,
      drawerVisible: true,
    }));
  };

  const onClose = async () => {
    fetchDataGetStaff();
    setState((prev) => ({ ...prev, drawerVisible: false }));
  };

  const columns = [
    {
      title: "Email",
      dataIndex: "email",
      width: "40%",
      ...getColumnSearchProps("email"),
      render: (email, record) => (
        <div style={{ cursor: "pointer" }}>
          <Tooltip
            placement="topLeft"
            title={email}
            color="hsla(340, 100%, 50%, 0.5)"
            key={record.sku}
            onClick={() => onClickStaff(record)}
          >
            {email}
          </Tooltip>
        </div>
      ),
    },
    {
      title: "Username",
      dataIndex: "userName",
      width: "30%",
      ...getColumnSearchProps("userName"),
    },
    {
      title: "Is Login",
      dataIndex: "isLogin",
      align: "center",
      width: "15%",
      filters: [
        {
          text: "True",
          value: "true",
        },
        {
          text: "False",
          value: "false",
        },
      ],
      onFilter: (value, record) => {
        return record.isLogin.toString().indexOf(value) === 0;
      },
      render: (isLogin, record) => (
        <div>
          <Popconfirm
            title="Do you want to change the status?"
            onConfirm={() => confirmIsLogin(record)}
          >
            <Switch checked={isLogin} />
          </Popconfirm>
        </div>
      ),
    },
    {
      title: "Is Active",
      dataIndex: "isActive",
      align: "center",
      width: "15%",
      filters: [
        {
          text: "True",
          value: "true",
        },
        {
          text: "False",
          value: "false",
        },
      ],
      defaultFilteredValue: ["true"],
      onFilter: (value, record) => {
        return record.isActive.toString().indexOf(value) === 0;
      },
      render: (isActive, record) => (
        <div>
          <Popconfirm
            title="Do you want to change the status?"
            onConfirm={() => confirmIsActive(record)}
          >
            <Switch checked={isActive} />
          </Popconfirm>
        </div>
      ),
    },
  ];

  const refresh = () => {
    setState({ ...initialState });
  };

  return (
    <>
      <br />
      <Button
        type="primary"
        size="small"
        onClick={refresh}
        icon={<ReloadOutlined />}
        style={{ backgroundColor: "hsla(340, 100%, 50%, 0.5)" }}
        className={"btn-Reload-Page-List-Of-StaffList"}
      >
        Reload Page
      </Button>

      <ExportReactCSV csvData={state.staffList} fileName="List of staffs" />
      <Divider />
      <AddStaff />

      <Table
        columns={columns}
        dataSource={state.staffList}
        footer={() => {
          const total =
            state.total || state.total === 0
              ? state.total
              : state.staffList.length;
          return <strong>Sum: {total}</strong>;
        }}
        onChange={(pagination, filters, sorter, extra) => {
          setState((prev) => ({
            ...prev,
            total: extra.currentDataSource.length,
          }));
        }}
      />

      {state.staff && (
        <Drawer
          title={state.staff.email}
          width={520}
          onClose={onClose}
          visible={state.drawerVisible}
          className={"drawer-staff-dashboard"}
        >
          <DrawerStaff
            staff={state.staff}
            drawerVisible={state.drawerVisible}
          />
        </Drawer>
      )}
    </>
  );
};

export { ListOfStaffs };
