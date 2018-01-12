import json

from flask import Flask, request, Response, session

import pwdmanage


DATABASE_FILENAME = 'users.json'
PAGES_FILENAME = 'pages.json'


app = Flask(__name__)
app.secret_key = 'A0Zr98j/3yX R~XHH!jmN]LWX/,?RT'


def update_database(data):
    with open(DATABASE_FILENAME, 'w') as jsonfile:
        json.dump(data, jsonfile, indent=4)


def udb_find_user_match(username, plain_password):
    '''Look for the user in database. None if not found, user's id otherwise '''
    with open(DATABASE_FILENAME, 'r') as jsonfile:
        data = jsonfile.read()
        data = json.loads(data)

        for user in data['users']:
            if user['username'] == username and pwdmanage.validate_password(plain_password, user['password']):
                return user['id']

    return None


def get_pages_json():
    '''Gets pages from pages.json file'''
    with open(PAGES_FILENAME, 'r') as jsonfile:
        data = jsonfile.read()
        data = json.loads(data)

        return data


def udb_get_username_with_id(user_id):
    '''Gets username from database knowing user id'''
    with open(DATABASE_FILENAME, 'r') as jsonfile:
        data = jsonfile.read()
        data = json.loads(data)

        for user in data['users']:
            if user['id'] == user_id:
                return user['username']

    return None


def udb_add_favorite_page(user_id, page_id):
    '''Search for user in database, add an id of favorite page'''
    with open(DATABASE_FILENAME, 'r') as jsonfile:
        data = jsonfile.read()
        data = json.loads(data)

        for user in data['users']:
            if user['id'] == user_id:
                pages = user['favPages']

                # already in favroite pages
                if page_id in pages:
                    return
                
                pages.append(int(page_id))
                user['favPages'] = list(set(pages))
                break

    update_database(data)


def udb_get_fav_pages(user_id):
    '''Find a list of user's favorite pages'''
    with open(DATABASE_FILENAME, 'r') as jsonfile:
        data = jsonfile.read()
        data = json.loads(data)

        for user in data['users']:
            if user['id'] == user_id:
                pages = list(map(lambda page_id: int(page_id), user['favPages']))
                return pages

    return []


def get_fav_pages(pages_ids):
    '''Matches ids of user favorite pages with pages'''
    with open(PAGES_FILENAME, 'r') as jsonfile:
        data = jsonfile.read()
        data = json.loads(data)
        pages = []

        for page in data['pages']:
            if int(page['id']) in pages_ids:
                pages.append(page)

    return pages


def udb_delete_fav_page(user_id, page_id):
    '''Deletes given page id from given user's favorite pages'''
    with open(DATABASE_FILENAME, 'r') as jsonfile:
        data = jsonfile.read()
        data = json.loads(data)

        for user in data['users']:
            if user['id'] == user_id:
                user['favPages'].remove(int(page_id))
                break

    update_database(data)
    
    return


def get_page_by_id(page_id):
    '''Loooks for certain page'''
    with open(PAGES_FILENAME, 'r') as jsonfile:
        data = jsonfile.read()
        data = json.loads(data)

        for page in data['pages']:
            if page['id'] == page_id:
                return page

    return {}


@app.route('/login', methods=['POST'])
def login():
    username = request.form['username']
    password = request.form['password']
    print(username)
    print(password)
    user_id = udb_find_user_match(username, password)
    session['user_id'] = user_id

    if user_id:
        status_code = 200
    else:
        status_code = 404
    
    return Response('{"userId": "' + str(user_id) + '"}', status=status_code, mimetype='application/json')


@app.route('/logout', methods=['GET'])
def logout():
    session.clear()

    return Response(status=200)


@app.route('/get_all_pages', methods=['GET'])
def get_all_pages():
    if len(session) > 0:
        pages = get_pages_json()
        status_code = 200
    else:
        pages = {}
        status_code = 404

    return Response(json.dumps(pages), status=status_code, mimetype='application/json')


@app.route('/get_username', methods=['GET'])
def get_username():
    if len(session) == 0:
        return Response(status=404)
    
    user_id = session['user_id']
    username = udb_get_username_with_id(user_id)

    return Response(json.dumps({'username': username}), status=200, mimetype='application/json')


@app.route('/add_favorite', methods=['POST'])
def add_favorite_page():
    if len(session) == 0:
        return Response(status=404)

    page_id = request.form['page_id']
    user_id = session['user_id']
    udb_add_favorite_page(user_id, page_id)

    return Response(status=200)


@app.route('/show_favorites', methods=['GET'])
def show_favorites():
    if len(session) == 0:
        return Response(status=404)

    user_id = session['user_id']
    pages_ids = udb_get_fav_pages(user_id)
    pages = get_fav_pages(pages_ids)

    return Response(json.dumps({'pages': pages}), status=200, mimetype='application/json')


@app.route('/delete_favorite', methods=['POST'])
def delete_fav_page():
    if len(session) == 0:
        return Response(status=404)
    
    page_id = request.form['page_id']
    user_id = session['user_id']
    udb_delete_fav_page(user_id, page_id)

    return Response(status=200)


@app.route('/get_page_by_id', methods=['POST'])
def get_page():
    page_id = request.form['page_id']
    page = get_page_by_id(page_id)
    print(page)

    return Response(json.dumps({'page': page}), status=200, mimetype='application/json')


if __name__ == '__main__':
    app.run(debug=True, port=8080) #ssl_context='adhoc'
