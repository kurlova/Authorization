import QtQuick 2.0
import QtQuick.Controls 2.2

import "views.js" as JS

Item {
    width: 200

    property string errorLabelText: ""
    property string passwordString: ""
    property string usernameString: ""

    Label {
        y: 10
        id: labelUsername
        text: 'Username'
        font.pixelSize: 15
    }
    TextField {
        id: username
        anchors.top: labelUsername.bottom
        anchors.topMargin: 10
        text: ""
        font.pixelSize: 15
        color: "gray"
    }

    Label {
        id: labelPassword
        text: 'Password'
        y: 100
        font.pixelSize: 15
    }
    TextField {
        id: password
        anchors.top: labelPassword.bottom
        anchors.topMargin: 10
        text: ""
        font.pixelSize: 15
        color: "gray"
        echoMode: TextInput.Password
    }
    Label {
        id: errorLabel
        anchors.bottom: loginBtn.top
        bottomPadding: 10
        text: errorLabelText
        color: 'red'
        font.pixelSize: 15
    }

    Button {
        id: loginBtn
        y: 230
        text: "Login"
        font.pixelSize: 15
        font.bold: true

        onClicked: {
            print(username.text)
            print(password.text)
            JS.log_in(username.text, password.text)
        }
    }
}
