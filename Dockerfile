FROM python:3.10-slim

# Install system dependencies for OpenCV/Ultralytics
RUN apt-get update && apt-get install -y \
    libgl1 \
    libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

RUN useradd -m -u 1000 user
USER user
ENV HOME=/home/user \
    PATH=/home/user/.local/bin:$PATH \
    PYTHONPATH=/home/user/app

WORKDIR $HOME/app

# Copy requirements from backend folder
COPY --chown=user backend/requirements.txt .
RUN pip install --no-cache-dir --user -r requirements.txt

# Copy all backend code into the container
COPY --chown=user backend/ .

ENV PORT=7860
EXPOSE $PORT

CMD uvicorn app.main:app --host 0.0.0.0 --port ${PORT}
