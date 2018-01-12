// run this file with qtquick
import QtQuick 2.0
import QtQuick.Window 2.0

Window {
    id: mainWindow
    width: 600
    height: 600

    Rectangle{
        id: mainRect
        x: parent.width / 2 - loginForm.width / 2
        y: parent.width / 5

        LoginForm {
            id: loginForm
            visible: true
        }
    }
}
