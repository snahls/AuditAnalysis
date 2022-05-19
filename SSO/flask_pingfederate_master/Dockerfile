FROM python:3.6
LABEL maintainer="kvandecr@cisco.com"

RUN pip install --no-cache flask "requests>=2.20.0" python-jose[pycryptodome]

ADD example /app/

ADD flask_pingfederate /tmp/Flask-PingFederate/flask_pingfederate
ADD setup.py /tmp/Flask-PingFederate/setup.py

RUN pip install --no-cache /tmp/Flask-PingFederate
RUN rm -r /tmp/Flask-PingFederate

USER www-data
WORKDIR /app
EXPOSE 8000

ENV SECRET_KEY ""
ENV PF_CLIENT_ID ""
ENV PF_CLIENT_SECRET ""
ENV PF_BASE_URL https://cloudsso.cisco.com

ENV FLASK_APP=DemoApp:app
ENV FLASK_RUN_HOST=0.0.0.0
ENV FLASK_RUN_PORT=8000
ENV FLASK_DEBUG=False
ENV FLASK_ENV=production

CMD ["flask", "run"]