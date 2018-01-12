var HOST_URL = 'http://localhost:8080'

// log in function
function log_in(username, password) {
    if (username && password) {
        var xhr = new XMLHttpRequest();
        xhr.open('POST', HOST_URL + '/login')
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhr.onreadystatechange = function() {
            if (xhr.readyState === XMLHttpRequest.HEADERS_RECEIVED) {
                print('HEADERS_RECEIVED')
            } else if(xhr.readyState === XMLHttpRequest.DONE) {
                print('DONE auth');
                var status = xhr.status;

                if (status == 200) {
                    var userId = JSON.parse(xhr.responseText)["userId"];
                    var component = Qt.createComponent("MainPage.qml");

                    if (component.status == Component.Ready) {
                        var x = 10;
                        var y = 10;
                        finishCreation(component, x, y);
                    } else
                        component.statusChanged.connect(finishCreation);

                    loginForm.visible = false;

                } else {
                    console.log('No such user in database');
                    loginForm.errorLabelText = 'No such user in database'
                }
            }
        }
        xhr.send("username=" + encodeURIComponent(username) + "&password=" + encodeURIComponent(password))
    } else {
        loginForm.errorLabelText = "Please fill all fields with values"
    }
}

// create QT component function
function finishCreation(component, x, y) {
    if (component.status == Component.Ready) {
        var sprite = component.createObject(mainWindow, {"x": x, "y": y});

        if (sprite == null) {
            // Error Handling
            console.log("Error creating object");
        }
    } else if (component.status == Component.Error) {
        // Error Handling
        console.log("Error loading component:", component.errorString());
    }
}

// log out function
function log_out() {
    var xhr = new XMLHttpRequest()
    xhr.open('GET', HOST_URL + '/logout')
    xhr.onreadystatechange = function() {
        if (xhr.readyState === XMLHttpRequest.HEADERS_RECEIVED) {
            print('HEADERS_RECEIVED')
        } else if(xhr.readyState === XMLHttpRequest.DONE) {
            var status = xhr.status

            if (status == 200) {
                print('DONE logout');
                mainPage.visible = false;
                loginForm.visible = true;
            } else {
                console.log('Can not log out for some reason')
            }
        }
    }
    xhr.send()
}


function get_all_pages() {
    var xhr = new XMLHttpRequest()
    xhr.open('GET', HOST_URL + '/get_all_pages')
    xhr.onreadystatechange = function() {
        if (xhr.readyState === XMLHttpRequest.HEADERS_RECEIVED) {
            print('HEADERS_RECEIVED')
        } else if(xhr.readyState === XMLHttpRequest.DONE) {
            var status = xhr.status
            if (status == 200) {
                print('DONE getting all pages');
                var pages = JSON.parse(xhr.responseText);
                listViewPages.model = pages['pages'] // bind to ListModel in MainPage.qml
            } else {
                console.log('All pages function returned 404')
            }
        }
    }
    xhr.send()
}

function get_username() {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', HOST_URL + '/get_username');
    xhr.onreadystatechange = function() {
        if (xhr.readyState === XMLHttpRequest.HEADERS_RECEIVED) {
            print('HEADERS_RECEIVED')
        } else if(xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status == 200) {
                var username = JSON.parse(xhr.responseText)['username'];
                mainPage.username = username
            }
        }
    }
    xhr.send();
}

function add_to_favorites(page_id) {
    var xhr = new XMLHttpRequest()
    xhr.open('POST', HOST_URL + '/add_favorite')
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.onreadystatechange = function() {
        if (xhr.readyState === XMLHttpRequest.HEADERS_RECEIVED) {
            print('HEADERS_RECEIVED')
        } else if(xhr.readyState === XMLHttpRequest.DONE) {
            console.log('page added')
            favPagesModel.append({"id": 10, "title": "TestPage", "content": "Test"})
            console.log('model appended')
        }
    }
    xhr.send("page_id=" + encodeURIComponent(page_id))
}

function get_page(page_id) {
    var xhr = new XMLHttpRequest()
    xhr.open('POST', HOST_URL + '/get_page_by_id')
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.onreadystatechange = function() {
        if (xhr.readyState === XMLHttpRequest.HEADERS_RECEIVED) {
            print('HEADERS_RECEIVED')
        } else if(xhr.readyState === XMLHttpRequest.DONE) {
            console.log(xhr.responseText['page'])
            return JSON.parse(xhr.responseText)['page']
        }
    }
    xhr.send("page_id=" + encodeURIComponent(page_id))
}

function get_favorites() {
    var xhr = new XMLHttpRequest()
    xhr.open('GET', HOST_URL + '/show_favorites')
    xhr.onreadystatechange = function() {
        if (xhr.readyState === XMLHttpRequest.HEADERS_RECEIVED) {
            print('HEADERS_RECEIVED')
        } else if(xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status == 200) {
                var pages = JSON.parse(xhr.responseText)['pages']
                listViewFavPages.model = pages // bind to ListModel in MainPage.qml
            }
        }
    }
    xhr.send()
}

function delete_favorite(page_id) {
    var xhr = new XMLHttpRequest()
    xhr.open('POST', HOST_URL + '/delete_favorite')
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.onreadystatechange = function() {
        if (xhr.readyState === XMLHttpRequest.HEADERS_RECEIVED) {
            print('HEADERS_RECEIVED')
        } else if(xhr.readyState === XMLHttpRequest.DONE) {
            console.log('item removed')
        }
    }
    xhr.send("page_id=" + encodeURIComponent(page_id))
}
