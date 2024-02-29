## 1. User

* Base URL: http://123.30.235.196:5388/landing-pages/v1
* Đối tượng User

| Field       | Type    | Require | Desciption                        |
| ----------- | ------- | ------- | --------------------------------- |
| userId      | string  | require | id người dùng                     |
| firstName   | string  | require | họ của người dùng                 |
| lastName    | string  | require | tên của người dùng                |
| email       | string  | require | email của người dùng              |
| password    | string  | require | mật khẩu của người dùng           |
| phone       | number  | require | số điện thoại của người dùng      |
| country     | string  | require | quốc gia của người dùng           |
| role        | string  | require | vai trò của người dùng            |
| isActivated | Boolean |         | tài khoản được kích hoạt hay chưa |

### 1.1 Login

- **Request**:

  - Method: POST
  - Path: /users/login
  - Param:

  | Field    | Type   | Require | Description             |
  | -------- | ------ | ------- | ----------------------- |
  | email    | string | require | email của người dùng    |
  | password | string | require | mật khẩu của người dùng |



- **Response data**:

  | Field | Type   | Require | Desciption        |
  | ----- | ------ | ------- | ----------------- |
  | ec    | number | require | mã lỗi            |
  | msg   | string | require | thông điệp lỗi    |
  | data  |  User object |         | đối tượng đăng ký |

### 1.2 Register

- **Request**:

  - Method: POST
  - Path: /users/register
  - Param:

  | Field     | Type   | Require | Description                   |
  | --------- | ------ | ------- | ----------------------------- |
  | firstName | string | require | họ của người dùng             |
  | lastName  | string | require | tên của người dùng            |
  | email     | string | require | email của người dùng          |
  | password  | string | require | mật khẩu của người dùng       |
  | phone     | number | require | số điện thoại  của người dùng |
  | country   | string | require | quốc gia của người dùng       |



- **Response data**:

  | Field | Type        | Require | Desciption        |
  | ----- | ----------- | ------- | ----------------- |
  | ec    | number      | require | mã lỗi            |
  | msg   | string      | require | thông điệp lỗi    |
  | data  | User object |         | đối tượng đăng ký |

  * Đối tượng User

  | Field       | Type    | Require | Desciption                        |
  | ----------- | ------- | ------- | --------------------------------- |
  | userId      | string  | require | id người dùng                     |
  | firstName   | string  | require | họ của người dùng                 |
  | lastName    | string  | require | tên của người dùng                |
  | email       | string  | require | email của người dùng              |
  | password    | string  | require | mật khẩu của người dùng           |
  | phone       | number  | require | số điện thoại của người dùng      |
  | country     | string  | require | quốc gia của người dùng           |
  | role        | string  | require | vai trò của người dùng            |
  | isActivated | Boolean |         | tài khoản được kích hoạt hay chưa |

### 1.3 Active account

- **Request**:

  - Method: POST
  - Path: /users/verify-email/:activateToken
  - Param:

  | Field         | Type   | Require | Description  |
  | ------------- | ------ | ------- | ------------ |
  | activateToken | string | require | mã kích hoạt |



- **Response data**:

  | Field | Type   | Require | Desciption        |
  | ----- | ------ | ------- | ----------------- |
  | ec    | number | require | mã lỗi            |
  | msg   | string | require | thông điệp lỗi    |
  | data  |  User object |         | đối tượng đăng ký |

  ### 1.4 Forgot password

- **Request**:

  - Method: POST
  - Path: /users/forgotPassword
  - Param:

  | Field | Type   | Require | Description          |
  | ----- | ------ | ------- | -------------------- |
  | email | string | require | email của người dùng |



- **Response data**:

  | Field | Type   | Require | Desciption        |
  | ----- | ------ | ------- | ----------------- |
  | ec    | number | require | mã lỗi            |
  | msg   | string | require | thông điệp lỗi    |
  | data  |  User object |         | đối tượng đăng ký |

  ### 1.5 Reset password

- **Request**:

  - Method: POST
  - Path: /users/reset-password/:resetPasswordToken
  - Param:

  | Field    | Type   | Require | Description  |
  | -------- | ------ | ------- | ------------ |
  | password | string | require | mật khẩu mới |



- **Response data**:

  | Field | Type   | Require | Desciption        |
  | ----- | ------ | ------- | ----------------- |
  | ec    | number | require | mã lỗi            |
  | msg   | string | require | thông điệp lỗi    |
  | data  |  User object |         | đối tượng đăng ký |

    ### 1.6 Change password

- **Request**:

  - Method: POST
  - Path: /users/change-password
  - Param:

  | Field              | Type   | Require | Description                      |
  | ------------------ | ------ | ------- | -------------------------------- |
  | currentPassword    | string | require | mật khẩu hiện tại của người dùng |
  | newPassword        | string | require | mật khẩu mới của người dùng      |
  | confirmNewPassword | string | require | xác nhận mật khẩu mới            |


- **Response data**:

  | Field | Type   | Require | Desciption        |
  | ----- | ------ | ------- | ----------------- |
  | ec    | number | require | mã lỗi            |
  | msg   | string | require | thông điệp lỗi    |
  | data  |  User object |         | đối tượng đăng ký |

## 2. Free trial
* Base URL: http://123.30.235.196:5388/landing-pages/v1
* Đối tượng Free trial

| Field       | Type    | Require | Desciption                        |
| ----------- | ------- | ------- | --------------------------------- |
| userId      | string  | require | id người dùng                     |
| firstName   | string  | require | họ của người dùng                 |
| lastName    | string  | require | tên của người dùng                |
| email       | string  | require | email của người dùng              |
| phone       | number  | require | số điện thoại của người dùng      |
| country     | string  | require | quốc gia của người dùng           |

### 2.1 Free Trial

- **Request**:

  - Method: POST
  - Path: /free-trial/
  - Param:

| Field       | Type    | Require | Desciption                        |
| ----------- | ------- | ------- | --------------------------------- |
| firstName   | string  | require | họ của người dùng                 |
| lastName    | string  | require | tên của người dùng                |
| email       | string  | require | email của người dùng              |
| phone       | number  | require | số điện thoại của người dùng      |
| country     | string  | require | quốc gia của người dùng           |

- **Response data**:

  | Field | Type   | Require | Desciption        |
  | ----- | ------ | ------- | ----------------- |
  | ec    | number | require | mã lỗi            |
  | msg   | string | require | thông điệp lỗi    |
  | data  |  User object |         | đối tượng đăng ký |
