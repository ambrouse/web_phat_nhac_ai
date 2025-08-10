import cv2
import mediapipe as mp
import numpy as np
import mediapipe as mp
import pyautogui
from flask import jsonify
import math


# setting mediapide
mp_hands = mp.solutions.hands
hands = mp_hands.Hands(
    max_num_hands=1,  # chỉ theo dõi 1 tay
    min_detection_confidence=0.7,
    min_tracking_confidence=0.7
)
mp_draw = mp.solutions.drawing_utils

# Lấy kích thước màn hình để điều chỉnh tọa độ
# screen_width, screen_height = pyautogui.size()
# alpha = 0.3 # alpha: hệ số làm mượt (0.2–0.5 là hợp lý)

# ratio de tinh threshold cho va cham cac diem ngon tay
touch_ratio=0.05

def test(img,smooth_x,smooth_y):
    if img is not None:
        image = cv2.flip(img, 1) # lat anh
        height, width, _ = image.shape
        image_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB) # Chuyển ảnh thành RGB
        result = hands.process(image_rgb)
        funtionAI = 0

        # Nếu phát hiện tay
        if result.multi_hand_landmarks:
            for hand_landmarks in result.multi_hand_landmarks:
                


                # dic huyen chuot theo ngon tro
                # # Lấy landmark ngón tay trỏ (số 8)
                # index_finger_tip = hand_landmarks.landmark[8]
                # x = int(index_finger_tip.x * width)
                # y = int(index_finger_tip.y * height)

                # # Điều chỉnh tọa độ sang màn hình
                # screen_x = index_finger_tip.x * screen_width
                # screen_y = index_finger_tip.y * screen_height

                # # mỗi frame:
                # smooth_x = alpha * screen_x + (1 - alpha) * smooth_x
                # smooth_y = alpha * screen_y + (1 - alpha) * smooth_y
                # Di chuyển chuột
                # pyautogui.moveTo(int(smooth_x), int(smooth_y))


                """
                    Bat dieu kien ngon tro va ngon cai cham nhau
                """
                thumb_tip = hand_landmarks.landmark[4]   # Ngón cái
                index_tip = hand_landmarks.landmark[8]   # Ngón trỏ
                middle_tip = hand_landmarks.landmark[12]  # ngon giua
                ring_tip = hand_landmarks.landmark[16]   # Ngón áp út tip
                pinky_tip = hand_landmarks.landmark[20]  # Ngón út tip

                dist_px_1 = calc_distance(thumb_tip, index_tip, width = width, height = height)
                dist_px_2 = calc_distance(thumb_tip, middle_tip, width = width, height = height)
                dist_px_3 = calc_distance(thumb_tip, ring_tip, width = width, height = height)
                dist_px_4 = calc_distance(thumb_tip, pinky_tip, width = width, height = height)

                threshold_px = touch_ratio * width

                # Ngưỡng 30px (tùy chỉnh theo camera)
                if dist_px_1 < threshold_px:
                    funtionAI = 1
                elif dist_px_2 < threshold_px:
                    funtionAI = 2
                elif dist_px_3 < threshold_px:
                    funtionAI = 3
                elif dist_px_4 < threshold_px:
                    funtionAI = 4

    return jsonify({"smooth_x": smooth_x, "smooth_y": smooth_y, "funtionAI":funtionAI})



# Hàm tính khoảng cách giữa 2 landmark
def calc_distance(lm1, lm2, width, height):
    x1, y1 = int(lm1.x * width), int(lm1.y * height)
    x2, y2 = int(lm2.x * width), int(lm2.y * height)
    return math.hypot(x2 - x1, y2 - y1)
    