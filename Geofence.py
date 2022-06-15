#!/usr/bin/env python3
from Car import Car
import datetime
from Car import State


class Geofence:
    def __init__(self, roundabout):
        self.waiting_cars_count = 0
        self.roundabout = roundabout

  #  def update_info(func):
  #      def wrapper():
   #         func()

   #     return wrapper

   # @update_info
    def increase_waiting_cars_count(self):
        self.waiting_cars_count += 1

    def enter(self, payload):
        # instatiate car from payload
        car = Car(payload["id"], payload["entry"],
                  payload["exit"], datetime, State.WAITING)
    # add to waiting queue
        self.wait_queue.append(car)
        self.increase_waiting_cars_count()
