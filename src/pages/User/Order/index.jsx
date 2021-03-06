import React, { useEffect, useState } from "react";
import "antd/dist/antd.css";
import "./index.css";
import { doNotGetData } from "../../../constants/doNotGetData";
import { QuestionCircleOutlined, ReloadOutlined } from "@ant-design/icons";
import {
  Button,
  Table,
  Tooltip,
  notification,
  Switch,
  Divider,
  Popconfirm,
  Drawer,
} from "antd";
import { useHistory } from "react-router";
import Cookies from "js-cookie";
import { getColumnSearchProps } from "../../../constants/getColumnSearchProps";
import { cancelOrder, orderOfUser } from "../../../api/order";
import { filterOrderStatus } from "../../../constants/orderStatus";
import { useDispatch, useSelector } from "react-redux";
import { insertOrderAll } from "../../../store/reducers/orderAll";
import { DrawerOrdersUser } from "./drawer";
import { insertOrder } from "../../../store/reducers/orderDetail";
import { getFeedback, getFormToFeedback } from "../../../api/feedback";
import { DrawerFeedback } from "./drawerFeedback";
import { NotFound } from "../../../_components/NotFound";

const Order = () => {
  const token = Cookies.get("token");
  const dispatch = useDispatch();
  const history = useHistory();
  const reduxOrderAll = useSelector((state) => state.orderAll.Order);

  const initialState = {
    orders: reduxOrderAll,
    order: null,
    feedback: null,
    lookFeedback: null,
    drawerFeedbackVisible: false,
    drawerLookFeedbackVisible: false,
    total: null,
    drawerVisible: false,
  };
  const [state, setState] = useState(initialState);

  // console.log("🦈🦈🦈🦈🦈🦈", state);

  const fetchData = async () => {
    const res = await orderOfUser(token);
    if (!res) {
      doNotGetData();
    }
    if (res) {
      if (res.success) {
        const keyAllOrder = res.data.map((item, index) => {
          const key = index;
          return { ...item, key };
        });
        dispatch(insertOrderAll({ newOrder: keyAllOrder }));

        setState((prev) => ({
          ...prev,
          orders: keyAllOrder,
        }));
      }
      if (!res.success) {
        if (res.message === "Token is expired") {
          Cookies.remove("token", { path: "/" });
          notification["warning"]({
            message: "Warning",
            description: `${res.message}`,
          });
          history.push("/account/sign-in/reload");
          window.location.reload();
        }
        notification["warning"]({
          message: "Warning: get orders of user",
          description: `${res.message}.`,
        });
      }
    }
  };

  useEffect(() => {
    const fetchData1 = async () => {
      const res = await orderOfUser(token);
      if (!res) {
        doNotGetData();
      }
      if (res) {
        if (res.success) {
          const keyAllOrder = res.data.map((item, index) => {
            const key = index;
            return { ...item, key };
          });
          dispatch(insertOrderAll({ newOrder: keyAllOrder }));

          setState((prev) => ({
            ...prev,
            orders: keyAllOrder,
          }));
        }
        if (!res.success) {
          if (res.message === "Token is expired") {
            Cookies.remove("token", { path: "/" });
            notification["warning"]({
              message: "Warning",
              description: `${res.message}`,
            });
            history.push("/account/sign-in/reload");
            window.location.reload();
          }
          notification["warning"]({
            message: "Warning: get orders of user",
            description: `${res.message}.`,
          });
        }
      }
    };
    fetchData1();
  }, [token, dispatch, history]);

  const refresh = () => {
    fetchData();
  };

  const onClickOrder = (record) => {
    // console.log("✅✅✅ Hello World", record);
    setState((prev) => ({
      ...prev,
      order: record,
      drawerVisible: true,
    }));
    dispatch(insertOrder({ newOrder: record }));
  };

  const confirm = async (record) => {
    const res = await getFormToFeedback(record._id, token);
    if (!res) {
      doNotGetData();
    }
    if (res) {
      if (res.success) {
        setState((prev) => ({
          ...prev,
          feedback: res.data,
          drawerFeedbackVisible: true,
          order: record,
        }));
      }
      if (!res.success) {
        if (res.message === "Token is expired") {
          Cookies.remove("token", { path: "/" });
          notification["warning"]({
            message: "Warning",
            description: `${res.message}`,
          });
          history.push("/account/sign-in/reload");
          window.location.reload();
        }
        notification["warning"]({
          message: "Warning",
          description: `${res.message}.`,
        });
      }
    }
  };

  const onClickCancel = async (record) => {
    const res = await cancelOrder(record._id, token);
    if (!res) {
      doNotGetData();
    }
    if (res) {
      if (res.success) {
        notification["success"]({
          message: "Success",
          description: `${res.data}`,
        });
        fetchData();
      }
      if (!res.success) {
        if (res.message === "Token is expired") {
          Cookies.remove("token", { path: "/" });
          notification["warning"]({
            message: "Warning: cancel order",
            description: `${res.message}`,
          });
          history.push("/account/sign-in/reload");
        }
        if (res.message !== "Token is expired") {
          notification["warning"]({
            message: "Warning: cancel order",
            description: `${res.message}.`,
          });
        }
      }
    }
  };

  const onClickLook = async (record) => {
    const res = await getFormToFeedback(record._id, token);

    if (!res) {
      doNotGetData();
    }
    if (res) {
      if (res.success) {
        const res_feedback = await getFeedback(record.orderCode, token);

        setState((prev) => ({
          ...prev,
          feedback: res.data,
          lookFeedback: res_feedback.data,
          drawerLookFeedbackVisible: true,
          order: record,
        }));
      }
      if (!res.success) {
        if (res.message === "Token is expired") {
          Cookies.remove("token", { path: "/" });
          notification["warning"]({
            message: "Warning",
            description: `${res.message}`,
          });
          history.push("/account/sign-in/reload");
          window.location.reload();
        }
        if (res.message !== "Token is expired") {
          notification["warning"]({
            message: "Warning",
            description: `${res.message}.`,
          });
        }
      }
    }
  };

  const columns = [
    {
      title: "Order Code",
      dataIndex: "orderCode",
      width: "20%",
      ...getColumnSearchProps("orderCode"),
      render: (orderCode, record) => (
        <div style={{ cursor: "pointer" }}>
          <Tooltip
            placement="topLeft"
            title={orderCode}
            color="hsla(340, 100%, 50%, 0.5)"
            key={record.orderCode}
            onClick={() => onClickOrder(record)}
          >
            {orderCode}
          </Tooltip>
        </div>
      ),
    },
    {
      title: "Order Date",
      dataIndex: "orderDate",
      width: "20%",
      ...getColumnSearchProps("orderDate"),
      defaultSortOrder: "descend",
      sorter: (a, b) => a.orderDate.localeCompare(b.orderDate),
    },
    {
      title: "Payments",
      dataIndex: "payments",
      width: "20%",
      filters: [
        {
          text: "Momo",
          value: "Momo",
        },
        {
          text: "COD",
          value: "COD",
        },
        {
          text: "Bank account",
          value: "Bank account",
        },
      ],
      onFilter: (value, record) => {
        return record.payments.indexOf(value) === 0;
      },
    },
    {
      title: "Order Status",
      dataIndex: "orderStatus",
      width: "20%",
      filters: filterOrderStatus,
      onFilter: (value, record) => {
        return record.orderStatus.indexOf(value) === 0;
      },
    },
    {
      title: "Feedback",
      dataIndex: "isFeedback",
      width: "10%",
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
        return record.isFeedback.toString().indexOf(value) === 0;
      },
      render: (isFeedback, record) => (
        <div>
          {record.orderStatus !== "Has received the goods" &&
            (record.orderStatus === "Waiting for confirmation" ||
            record.orderStatus === "Waiting for the goods" ? (
              <>
                <>
                  <Switch checked={isFeedback} disabled />
                  <Popconfirm
                    title="Are you sure？"
                    icon={<QuestionCircleOutlined style={{ color: "red" }} />}
                    onConfirm={() => onClickCancel(record)}
                  >
                    <span
                      style={{
                        cursor: "pointer",
                        color: "rgba(255, 0, 85, 0.5)",
                        fontWeight: "bold",
                        marginLeft: "10px",
                      }}
                    >
                      Cancel
                    </span>
                  </Popconfirm>
                </>
              </>
            ) : (
              <>
                <Switch checked={isFeedback} disabled />
              </>
            ))}
          {record.orderStatus === "Has received the goods" ? (
            record.isFeedback ? (
              <>
                <Switch checked={isFeedback} disabled />
                <span
                  style={{
                    cursor: "pointer",
                    color: "rgba(255, 0, 85, 0.5)",
                    fontWeight: "bold",
                    marginLeft: "10px",
                  }}
                  onClick={() => onClickLook(record)}
                >
                  Look
                </span>
              </>
            ) : (
              <Popconfirm
                title="Do you want feedback?"
                onConfirm={() => confirm(record)}
              >
                <Switch checked={isFeedback} />
              </Popconfirm>
            )
          ) : (
            <></>
          )}
        </div>
      ),
    },
  ];

  const onClose = async () => {
    setState((prev) => ({
      ...prev,
      order: null,
      drawerVisible: false,
    }));
  };

  const onCloseFeedback = async () => {
    fetchData();
    setState((prev) => ({
      ...prev,
      drawerFeedbackVisible: false,
      feedback: null,
      order: null,
    }));
  };

  const onCloseLookFeedback = async () => {
    fetchData();
    setState((prev) => ({
      ...prev,
      drawerLookFeedbackVisible: false,
      feedback: null,
      order: null,
      lookFeedback: null,
    }));
  };

  return (
    <>
      {token ? (
        <div className="html-user-orders">
          <Button
            type="primary"
            size="small"
            onClick={refresh}
            icon={<ReloadOutlined />}
            style={{ backgroundColor: "hsla(340, 100%, 50%, 0.5)" }}
            className={"btn-Reload-Page-List-Of-Orders"}
          >
            Reload Page
          </Button>
          <Divider />
          <Table
            columns={columns}
            dataSource={state.orders}
            footer={() => {
              const total =
                state.total || state.total === 0
                  ? state.total
                  : state.orders.length;
              return <strong>Sum: {total}</strong>;
            }}
            onChange={(pagination, filters, sorter, extra) => {
              setState((prev) => ({
                ...prev,
                total: extra.currentDataSource.length,
              }));
            }}
          />
          {state.order && (
            <Drawer
              title={state.order.orderCode}
              width={520}
              onClose={onClose}
              visible={state.drawerVisible}
              className={"drawer-order-dashboard"}
            >
              <DrawerOrdersUser
                id={state.order._id}
                order={state.order}
                drawerVisible={state.drawerVisible}
              />
            </Drawer>
          )}
          {state.feedback && (
            <Drawer
              title={state.order.orderCode}
              width={520}
              onClose={onCloseFeedback}
              visible={state.drawerFeedbackVisible}
              className={"drawer-order-dashboard"}
            >
              <DrawerFeedback
                id={state.order._id}
                order={state.order}
                feedback={state.feedback}
                drawerVisible={state.drawerFeedbackVisible}
              />
            </Drawer>
          )}
          {state.lookFeedback && (
            <Drawer
              title={state.order.orderCode}
              width={520}
              onClose={onCloseLookFeedback}
              visible={state.drawerLookFeedbackVisible}
              className={"drawer-order-dashboard"}
            >
              <DrawerFeedback
                id={state.order._id}
                order={state.order}
                feedback={state.feedback}
                lookFeedback={state.lookFeedback}
                drawerVisible={state.drawerLookFeedbackVisible}
              />
            </Drawer>
          )}
        </div>
      ) : (
        <NotFound />
      )}
    </>
  );
};

export { Order };
