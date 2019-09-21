FROM postgres:10.5

RUN apt-get update
RUN apt-get install -y --no-install-recommends postgresql-10-postgis-2.4 postgresql-10-postgis-2.4-scripts postgis
RUN rm -rf /var/lib/apt/lists/*
