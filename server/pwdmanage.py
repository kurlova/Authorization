from passlib.hash import sha256_crypt


def validate_password(plain_password, enc_password):
    '''Compare plain password with value in database'''
    return sha256_crypt.verify(plain_password, enc_password)


def encrypt_password(password):
    return sha256_crypt.encrypt(password)


# for testing purpose
if __name__ == '__main__':
    encp = encrypt_password('098765')
    print(encp)