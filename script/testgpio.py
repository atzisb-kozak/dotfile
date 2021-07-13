from gpiozero import MCP3008
from time import sleep
import signal
import sys

pot1 = MCP3008(0, 8)
pot2 = MCP3008(4, 7)

def signal_handler(sig, frame):
	"""SIGINT Signal handle to exit gracefully

	Args:
			sig ([None]): [signal]
			frame ([None]): [frame]
	"""

	print('You pressed Ctrl+C!')
	sys.exit(0)

def main() :
	while True:
		print("CAN No 0 pin 8 => {}".format(pot1.value))
		print("CAN No 4 pin 7 => {}".format(pot2.value))
		sleep(1)


if __name__ == "__main__":
	signal.signal(signal.SIGINT, signal_handler)
	main()