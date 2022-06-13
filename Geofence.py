#!/usr/bin/env python3

class Geofence:
    def __init__(self, roundabout):
        self.waiting_cars_count = 0
        self.roundabout = roundabout
        self.wait_queue = []

    def get_waiting_cars_count(self):
        self.waiting_cars_count = self.wait_queue.count
