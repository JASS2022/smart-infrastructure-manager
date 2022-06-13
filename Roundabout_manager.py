#!/usr/bin/env python3
from Car import Car
from Car import State
import datetime


class Roundabout_manager:
    def __init__(self, roundabout, strategy):
        self.roundabout = roundabout
        self.wait_queue = []
        self.inroundabout = []
        self.strategy = strategy
        self.segments = 8
        # self.occupancy = np.zeros((10, self.segments))

    def register_car(self, payload):
        car = Car(payload["id"], payload["entry"],
                  payload["exit"], datetime, State.WAITING)
        self.enter(car)

    # def manage_roundabout(self):
    # while True:
    # sleep(60 - time() % 60)

    def enter(self, car):
        #self.path = generate_path(car.entrance, car.exit)
        # car.set_path(self.path)
        self.wait_queue.append(car)

    def exit(self, car):
        self.wait_queue.remove(car)

    # def do_controlling(self):
    #     toGo = self.strategy.do_scheduling(self.wait_queue, self.occupancy)
    #     self.inroudabout = + toGo
    #     return toGo

    # def generate_path(self,interance,exit):
    #   length = 0
    #   if interance == 1 and exit == 2:
    #     length = 1 + segments//3
    #   elif interance == 1 and exit == 3:
    #     length = 1 + 2*(segments//3)
    #   elif interance == 1 and exit == 1:
    #     length = 1 + 3*(segments//3)
    #   elif interance == 2 and exit == 3:
    #     length = 1 + segments//3
    #   elif interance == 2 and exit == 1:
    #     length = 1 + 2*(segments//3)
    #   elif interance == 2 and exit == 2:
    #     length = 1 + 3*(segments//3)
    #   elif interance == 3 and exit == 1:
    #     length = 1 + segments//3
    #   elif interance == 3 and exit == 2:
    #     length = 1 + 2*(segments//3)
    #   elif interance == 3 and exit == 3:
    #     length = 1 + 3*(segments//3)

    #   if interance == 1:
    #     interance = 1
    #   elif interance == 2:
    #     interance =  1 + (segments//3)
    #   elif interance == 3:
    #     interance =  1 + 2*(segments//3)

    #   array = np.zeros(length)
    #   i=interance
    #   for x in range(0,length):
    #     if i<=(segments):
    #       array[x] = i
    #       i = i+1
    #     else:
    #       i=1
    #       array[x] = i
    #       i = i+1
    #   return array
