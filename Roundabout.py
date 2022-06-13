#!/usr/bin/env python3

class Roundabout:
    def __init__(self, entrances, exits):
        self.entrances = entrances
        self.exits = exits
        self.maxCapacity = 8
        self.current_capacity = 0
        self.inroundabout = []

    def get_current_capacity(self):
        self.current_capacity = self.inroundabout.count
