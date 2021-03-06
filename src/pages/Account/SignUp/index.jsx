import React, { useEffect, useState } from "react";
import "./index.css";
import "antd/dist/antd.css";
import {
  Form,
  Input,
  Button,
  DatePicker,
  Radio,
  InputNumber,
  notification,
} from "antd";
import { validateMessages } from "./../../../constants/validateMessages";
import { signUp } from "../../../api/auth";
import { useHistory } from "react-router-dom";
import Cookies from "js-cookie";
import { SuccessPage } from "../../../_components/SuccessPage";

const SignUp = () => {
  const history = useHistory();
  const token = Cookies.get("token");
  if (token) {
    history.push("/home");
  }

  const initialState = {
    result: false,
    title: null,
  };
  const [state, setState] = useState(initialState);
  useEffect(() => {
    setState((prev) => ({ ...prev, result: false, title: null }));
  }, []);

  const onFinish = async (values) => {
    // console.log("Success:", values);
    values.dayOfBirth = values.dayOfBirth._d;
    values.phone = "0" + values.phone;

    const res = await signUp(values);
    if (res === null) {
      history.push("/server-upgrade");
    } else if (res.success === true) {
      setState((prev) => ({ ...prev, result: true, title: res.data }));
    } else if (res.success === false) {
      if (res.code === 404 || res.code === 403) {
        notification["warning"]({
          message: "Warning",
          description: `${res.message}`,
        });
      } else {
        if (typeof res.message === "object") {
          const message = Object.keys(res.message).map((key) => {
            return res.message[key];
          });
          notification["warning"]({
            message: "Warning: sign up",
            description: `${message}`,
          });
        }
        if (typeof res.message !== "object") {
          notification["error"]({
            message: "Error",
            description: `${res.message}`,
          });
        }
      }
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <>
      {state.result ? (
        <>
          <SuccessPage title={state.title} />
        </>
      ) : (
        <div className="htmlRegister" id="htmlRegister">
          <div id="stars"></div>
          <div id="stars2"></div>
          <div id="stars3"></div>
          <div className="registerform">
            <h1 className="texttop" style={{ color: "white" }}>
              Sign Up
            </h1>
            <Form
              className={"my-regiterform"}
              labelCol={{
                span: 8,
              }}
              wrapperCol={{
                span: 8,
              }}
              style={{ height: "100%", width: "100%" }}
              initialValues={{
                remember: true,
              }}
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
              validateMessages={validateMessages}
            >
              <Form.Item
                label="Username"
                name="userName"
                rules={[
                  {
                    required: true,
                    type: "string",
                    min: 6,
                    max: 32,
                  },
                ]}
              >
                <Input placeholder="Username" />
              </Form.Item>

              <Form.Item
                label="Full Name"
                name="fullName"
                rules={[
                  {
                    required: true,
                    type: "string",
                    min: 3,
                    max: 50,
                  },
                ]}
              >
                <Input placeholder="Full Name" />
              </Form.Item>

              <Form.Item
                label="Email"
                name="email"
                rules={[
                  {
                    required: true,
                    type: "email",
                  },
                ]}
              >
                <Input placeholder="Email" />
              </Form.Item>

              <Form.Item
                label="DOB"
                name="dayOfBirth"
                rules={[
                  {
                    required: true,
                    type: "date",
                  },
                ]}
              >
                <DatePicker style={{ width: "100%" }}></DatePicker>
              </Form.Item>

              <Form.Item
                name="gender"
                label="Gender"
                rules={[
                  {
                    required: true,
                  },
                ]}
              >
                <Radio.Group>
                  <Radio value="Male" style={{ color: "white" }}>
                    Male
                  </Radio>
                  <Radio value="Female" style={{ color: "white" }}>
                    Female
                  </Radio>
                </Radio.Group>
              </Form.Item>

              <Form.Item
                label="Phone"
                name="phone"
                rules={[
                  {
                    required: true,
                    type: "number",
                    max: 1000000000,
                  },
                ]}
              >
                <InputNumber placeholder="Phone" style={{ width: "100%" }} />
              </Form.Item>

              <Form.Item
                label="Password"
                name="password"
                rules={[
                  {
                    required: true,
                    type: "string",
                    min: 6,
                    max: 50,
                  },
                ]}
              >
                <Input.Password placeholder="Password" />
              </Form.Item>

              <Form.Item
                label="Confirm Password"
                name="confirmpassword"
                dependencies={["password"]}
                hasFeedback
                rules={[
                  {
                    required: true,
                  },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue("password") === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(
                        new Error(
                          "The two passwords that you entered do not match!"
                        )
                      );
                    },
                  }),
                ]}
              >
                <Input.Password placeholder="Confirm Password" />
              </Form.Item>

              <Form.Item
                wrapperCol={{
                  offset: 8,
                  span: 16,
                }}
              >
                <Button type="primary" htmlType="submit">
                  Register
                </Button>
              </Form.Item>
            </Form>
          </div>
          <div className="night">
            {Array.of(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13).map((val) => (
              <div className="shooting_star" key={val}></div>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export { SignUp };
