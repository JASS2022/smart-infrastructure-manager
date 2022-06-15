#!/usr/bin/env python3
from Car import Car
from Car import State
import datetime
import numpy as np
import time
import Geofence
from Strategy import Strategy, EmergencyStrategy


class Roundabout:
    def __init__(self, entrances, exits, geofence, strategy):
        self.entrances = entrances
        self.exits = exits
        self.maxCapacity = 8
        self.current_capacity = 0
        self.inroundabout = []
        self._strategy = strategy
        self.wait_queue = []
        self.strategy = strategy
        self.segments = 8
        self.occupancy = np.zeros((10, self.segments))
        self.time_step = 2
        self.starting_time = time.time()
        self.geofence = geofence

    @property
    def strategy(self) -> Strategy:
        return self._strategy

    @strategy.setter
    def strategy(self, strategy: Strategy) -> None:
        """
        Usually, the Context allows switching between Strategys at object at runtime.
        """
        self._strategy = strategy

    def enter(self, payload):
        # instatiate car from payload
        print('pl: ', payload)
        car = Car(payload["carId"], int(payload["entry"]),
                  int(payload["exit"]), datetime, State.WAITING)
        path = self.generate_path(car.entrance, car.exit)
        car.set_path(path)
    # add to waiting queue
        self.wait_queue.append(car)

    def do_scheduling_logic(self):
        """
        The RoundaboutManager delegates some work to the Strategy object instead of
        implementing multiple versions of the algorithm on its own.
        """
        toGo, notToGo = self.strategy.do_scheduling(
            self.wait_queue, self.occupancy)
        self.wait_queue = notToGo
        self.inroundabout.extend(toGo)
        return toGo

    def exit(self, car_id):
        notLeaving = []
        for car in self.inroundabout:
            if car.id != car_id:
                notLeaving.append(car)
        self.inroundabout = notLeaving

    def update_path(self, payload):
        for car in self.inroundabout:
            if car.id == payload["carId"]:
                segment = [payload["location"]["x"], payload["location"]["y"]]
                car.update_path(segment)

    def generate_path(self, entrance: int, exit: int):
        """
        The RoundaboutManager generate the path that the car should take according to its segmentation
        """
        length = 0
        if entrance == 1 and exit == 2:
            length = 7
        elif entrance == 1 and exit == 3:
            length = 5
        elif entrance == 1 and exit == 1:
            length = 9
        elif entrance == 2 and exit == 3:
            length = 7
        elif entrance == 2 and exit == 1:
            length = 3
        elif entrance == 2 and exit == 2:
            length = 9
        elif entrance == 3 and exit == 1:
            length = 5
        elif entrance == 3 and exit == 2:
            length = 3
        elif entrance == 3 and exit == 3:
            length = 9

        if entrance == 1:
            entrance = 8
        elif entrance == 2:
            entrance = 6
        elif entrance == 3:
            entrance = 4

        array = []
        i = entrance
        for x in range(0, length):
            if i <= (8):
                array.append(int(i))
                i = i+1
            else:
                i = 1
                array.append(int(i))
                i = i+1
        return array

    def manage_roundabout(self):
        """
        The Context delegates some work to the Strategy object instead of
        implementing multiple versions of the algorithm on its own.
        """
        # if(time.time() - self.starting_time % 2 == 0):
        # Handle all the actions that arrived during the sleeping phase: return type is a list of cars
        # self.enter(car)
        self.update_occupancy()
        print("+++++++++++++++++++++Occupancy+++++++++++++++ \n")
        print(self.occupancy)

        scheduled_cars = self.do_scheduling_logic()

        print("+++++++++++++++++++++Occupancy After Scheduling+++++++++++++++ \n")
        print(self.occupancy)
        print(f"scheduled cars {[x.id for x in scheduled_cars]}")
        # call the city manager and inform about the schedule cars
        return scheduled_cars

    def update_occupancy(self) -> None:
        """
        The RoundaboutManager updates its occupancy matrix at each time step
        """
        for i in range(0, len(self.occupancy)-1):
            self.occupancy[i] = self.occupancy[i+1]
