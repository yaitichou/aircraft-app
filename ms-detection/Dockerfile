FROM ubuntu:latest

ADD https://ultralytics.com/assets/Arial.ttf https://ultralytics.com/assets/Arial.Unicode.ttf /root/.config/Ultralytics/
ENV DEBIAN_FRONTEND=noninteractive
RUN apt-get update
RUN TZ=Etc/UTC apt-get install -y tzdata

RUN apt-get install --no-install-recommends -y python3-pip git zip curl htop libgl1-mesa-glx libglib2.0-0 libpython3-dev gnupg
COPY requirements.txt .

RUN python3 -m pip install --upgrade pip wheel
RUN pip install --no-cache -r requirements.txt albumentations gsutil notebook coremltools onnx onnx-simplifier onnxruntime 'openvino-dev>=2022.3' --extra-index-url https://download.pytorch.org/whl/cpu
RUN mkdir -p /usr/src/app

WORKDIR /usr/src/app
RUN git clone https://github.com/ultralytics/yolov5 /usr/src/app
ENV DEBIAN_FRONTEND=teletype
RUN pip install ultralytics fastapi uvicorn python-multipart

COPY best.onnx .
COPY worker.py .
COPY start.sh /start.sh

RUN chmod +x /start.sh

EXPOSE 80

CMD ["/start.sh"]