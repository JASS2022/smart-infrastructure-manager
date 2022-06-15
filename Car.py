#!/usr/bin/env python3

from typing import List
import datetime
from enum import Enum


class State(Enum):
    WAITING = "Waiting"
    MOVING = "Moving"


class Car:

    def __init__(self, id, entrance, exit, entrance_time, speed):
        self.id = id
        self.entrance = entrance
        self.exit = exit
        self.entrance_time = entrance_time
        self.speed = speed
        self.inGeofence = datetime.datetime.now()
        self.path = []
        self.state = State.WAITING

    def get_waiting_time(self):
        return datetime.datetime.now() - self.inGeofence

    def update_path(self, segment):
        self.path = segment

    def set_path(self, path):
        self.path = path

    def decrement_time_left(self):
        self.time_left -= 1
