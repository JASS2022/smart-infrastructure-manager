#!/usr/bin/env python3
import Car
import datetime


class RoundaboutManager:
    def __init__(self, roundabout, strategy):
        self.roundabout = roundabout
        self.wait_queue = []
        self.inroundabout = []
        self.strategy = strategy
        self.segments = 8
        self.occupancy = np.zeros((10, self.segments))

    def enter(self, car):
        path = self.generate_path(car.entrance, car.exit)
        car.set_path(path)
        self.wait_queue.append(car)

    def registerCar(self, payload):
        car = Car(payload["id"], payload["entry"],
                  payload["exit"], datetime, Car.State.WAITING)
        enter(self, car)
