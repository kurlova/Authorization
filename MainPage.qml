import QtQuick 2.0
import QtQuick.Controls 2.2

import "views.js" as JS

Item {
    id: mainPage
    width: mainWindow.width
    height: mainWindow.height
    x: 20

    property string username

    // HEADER ITEM
    Item {
        id: header
        width: mainPage.width
        height: 100
        anchors.bottomMargin: 20

        Grid {
            width: parent.width
            height: parent.height
            columns: 2

            Rectangle {
                width: parent.width/5 * 4
                height: parent.height
                color: "transparent"

                Label {
                    text: "Hello, " + username + "!"
                    font.pixelSize: 30
                    anchors.verticalCenter: parent.verticalCenter
                }
            }

            Rectangle {
                width: parent.width/5
                height: parent.height
                color: "transparent"

                Button {
                    id: logoutBtn
                    text: 'Logout'
                    anchors.verticalCenter: parent.verticalCenter
                    font.pixelSize: 15
                    font.bold: true

                    onClicked: {
                        JS.log_out()
                    }
                }
            }
        }
    }

    Grid {
        columns: 2
        spacing: 10
        anchors.top: header.bottom

        // ALL PAGES ITEM
        Item {
            id: allPagesItem
            width: mainWindow.width / 2;
            height: listViewPages.count * allPagesItem.elementHeight + 20

            property int elementHeight: 40

            Label {
                id: allPagesLabel
                text: "List of all pages"
                font.pixelSize: 20
            }

            Rectangle {
                id: pagesRect
                width: allPagesItem.width
                height: allPagesItem.height
                color: "transparent"
                anchors.top: allPagesLabel.bottom
                anchors.topMargin: 20

                Component {
                    id: contactDelegate

                    Item {
                        width: mainWindow.width; height: allPagesItem.elementHeight

                        Grid {
                            columns: 2
                            spacing: 5

                            Column {
                                height: allPagesItem.elementHeight
                                Button {
                                    anchors.rightMargin: 5
                                    width: 30; height: 30

                                    text: "+"
                                    font.pixelSize: 20
                                    font.bold: true

                                    background: Rectangle {
                                        radius: 3
                                        color: "green"
                                    }

                                    onClicked: {
                                        JS.add_to_favorites(modelData.id)

                                    }
                                }
                            }
                            Column {
                                Label {
                                    text: modelData.title
                                    font.pixelSize: 15
                                }
                            }
                        }
                    }
                }

                Component.onCompleted: {
                    JS.get_all_pages()
                    JS.get_username()
                }

                ListView {
                    id: listViewPages
                    anchors.fill: parent
                    delegate: contactDelegate
                }
            }
        }

        // FAVORITE PAGES ITEM
        Item {
            id: favPagesItem
            width: mainPage.width / 2
            height: listViewFavPages.count * favPagesItem.elementHeight

            property int elementHeight: 40

            Label {
                id: favPagesLabel
                text: "List of favorite pages"
                font.pixelSize: 20
            }

            Rectangle {
                id: favPagesRect
                width: favPagesItem.width
                height: favPagesItem.height
                color: "transparent"
                anchors.top: favPagesLabel.bottom
                anchors.topMargin: 20

                Component {
                    id: favPagesDelegate

                    Item {
                        width: mainWindow.width; height: favPagesItem.elementHeight

                        Grid {
                            columns: 2
                            spacing: 5
                            Column {
                                Button {
                                    anchors.rightMargin: 5
                                    text: "-"
                                    width: 30; height: 30
                                    font.pixelSize: 20
                                    font.bold: true

                                    background: Rectangle {
                                        radius: 3
                                        color: "red"
                                    }

                                    onClicked: {
                                        JS.delete_favorite(modelData.id)
                                    }
                                }
                            }

                            Column {
                                Label {
                                    text: modelData.title
                                    font.pixelSize: 15
                                }
                            }
                        }
                    }
                }

                Component.onCompleted: {
                    JS.get_favorites()
                }

                ListView {
                    id: listViewFavPages
                    anchors.fill: parent
                    delegate: favPagesDelegate
                    model: favPagesModel
                }

                ListModel {
                    id: favPagesModel
                }
            }
        }
    }
}
