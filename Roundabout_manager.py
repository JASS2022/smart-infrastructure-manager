#!/usr/bin/env python3
from Car import Car
from Car import State
import datetime
import Geofence


class Roundabout_manager:
    def __init__(self, roundabout, geofence, strategy):
        self.roundabout = roundabout
        self.strategy = strategy
        self.segments = 8
        self.geofence = geofence
        # self.occupancy = np.zeros((10, self.segments))

    def enter_geofence(self, payload):
      # instatiate car from payload
        car = Car(payload["id"], payload["entry"],
                  payload["exit"], datetime, State.WAITING)
      # add to waiting queue
        self.geofence.wait_queue.append(car)
        self.geofence.increase_waiting_cars_count()

    def enter_roundabout(self, car_id):

        # remove from geofence wait queue
        for car in self.geofence.wait_queue:
            if car.car_id == car_id:
                self.geofence.wait_queue.remove(car)

            # add to inroundabout queue

        self.roundabout.inroundabout_queue.append(car)
        self.roundabout.increase_current_capacity()

    def exit(self, car_id):
        for car in self.roundabout.inroundabout_queue:
            if car.car_id == car_id:
                self.roundabout.inroundabout_queue.remove(car)

    # def manage_roundabout(self):
    # while True:
    # sleep(60 - time() % 60)

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
