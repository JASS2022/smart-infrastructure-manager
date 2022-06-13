#!/usr/bin/env python3

class Roundabout:
    def __init__(self, entrances, exits):
        self.entrances = entrances
        self.exits = exits
        self.maxCapacity = 8
        self.current_capacity = 0
        self.inroundabout_queue = []

    def increase_current_capacity(self):
        self.current_capacity += 1