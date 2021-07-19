from gpiozero import MCP3008
from time import sleep
import signal
import sys

pot1 = MCP3008(channel=0, device=0)
pot2 = MCP3008(channel=4, device=1)

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
		print("CAN No 0 pin 8 => {}".format(pot1.value*40))
		print("CAN No 4 pin 7 => {}".format(pot2.value*40))
		sleep(1)


if __name__ == "__main__":
	signal.signal(signal.SIGINT, signal_handler)
	main()
