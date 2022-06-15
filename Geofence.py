#!/usr/bin/env python3
from Car import Car
import datetime
from Car import State


class Geofence:
    def __init__(self, radius):
        self.radius = radius
