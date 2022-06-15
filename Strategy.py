from abc import ABC, abstractmethod


class Strategy(ABC):
    """
    The Strategy interface declares the do_schedule operation common to all supported versions
    of the scheduling algorithm.

    The RoundaboutManager uses this interface to call the algorithm defined by Concrete
    Strategies.
    """
    @abstractmethod
    def do_scheduling(self, wait_queue, occupancy):
        pass


class VacationStrategy(Strategy):
    def do_scheduling(self, wait_queue, occupancy):
        toGo = []
        notToGo = []
        for car in wait_queue:
            if occupancy[0][car.path[0]-1] == 0:
                for index, position in enumerate(car.path):
                    occupancy[index][position-1] = 1
                car.time_left = len(car.path)
                toGo.append(car)
            elif occupancy[0][car.path[0]-1] == 1 and car.get_waiting_time() >= 48:
                break
        for car in wait_queue:
            if (toGo.count(car) == 0):
                car.set_waiting_time()
                notToGo.append(car)
        return toGo, notToGo


class EmergencyStrategy(Strategy):
    def do_scheduling(self, wait_queue, occupancy):
        toGo = []
        notToGo = []
        return toGo, notToGo
