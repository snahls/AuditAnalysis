from setuptools import setup


setup(
    name='Flask-PingFederate',
    version='1.4.1',
    url='https://wwwin-gitlab-sjc.cisco.com/kvandecr/flask-pingfederate',
    license='All rights reserved',
    author='kvandecr',
    author_email='kvandecr@cisco.com',
    description='PingFederate Authorization Code flow extension for Flask',
    long_description=__doc__,
    packages=['flask_pingfederate'],
    zip_safe=False,
    include_package_data=True,
    platforms='any',
    install_requires=[
        'Flask', 'requests', 'python-jose-cryptodome'
    ],
    classifiers=[
        'Environment :: Web Environment',
        'Intended Audience :: Developers',
        'Operating System :: OS Independent',
        'Programming Language :: Python',
        'Topic :: Internet :: WWW/HTTP :: Dynamic Content',
        'Topic :: Software Development :: Libraries :: Python Modules'
    ]
)