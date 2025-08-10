import cv2

cap = cv2.VideoCapture(0)  # 0 là camera mặc định

if cap.isOpened():
    print("Camera sẵn sàng và không bị chiếm dụng.")
    cap.release()
else:
    print("Camera đang bị chiếm dụng hoặc không thể truy cập.")