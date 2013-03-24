import boto
from boto.s3.key import Key
import os

conn = boto.connect_s3()
bucket = conn.get_bucket('world-of-battle-city')

k = Key(bucket)

path = 'src/main/web'
for dirname, dirnames, filenames in os.walk(path):
    for filename in filenames:
        fullname = os.path.join(dirname, filename)
        key = dirname.replace(path, '') + '/' + filename
        print 'uploading %s to %s' % (fullname, key)
        k.key = key
        k.set_contents_from_filename(fullname)

bucket.make_public(True)

