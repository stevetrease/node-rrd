# http://www.jibble.org/currentcost/
# Reads data from a Current Cost device via serial port.

cd /home/steve/node-rrd

for period in 1h 3h 6h 12h 1d 1w 1m 1y 2y 4y
do
	rrdtool graph /dev/null \
	--width 2000 -h 10 -z -s -$period --slope-mode \
	DEF:Power=data/currentcost-w0.rrd:WATTS:AVERAGE \
	CDEF:PowerH=Power,3600,\/ \
	VDEF:PowerUsedH=PowerH,TOTAL \
	PRINT:PowerUsedH:"%1.1lf%s" | tail -1 > graphs/currentcost_$period.txt

	rrdtool graph graphs/currentcost-$period.svg -a SVG \
	--width 700 -h 300 -s -$period --slope-mode \
	-z --no-legend --vertical-label Watts --lower-limit 0 \
	--alt-autoscale-max \
	DEF:Power=data/currentcost-w0.rrd:WATTS:AVERAGE \
	DEF:PowerMax=data/currentcost-w0.rrd:WATTS:MAX \
	VDEF:PowerAve=Power,AVERAGE \
	VDEF:PowerPeak=Power,MAXIMUM \
	CDEF:PowerRange=PowerMax \
	AREA:PowerRange#0000FF11:"Error Range":STACK \
	LINE1:PowerMax#0000FF22:"Max" \
	LINE1:Power#0000FF:"Average" \
	LINE2:PowerAve#0000FF55:"Average" \
	LINE3:PowerPeak#FF000011:"Peak" 

	rrdtool graph graphs/currentcost-$period.svg -a SVG \
	--width 700 -h 300 -s -$period --slope-mode \
	--vertical-label Watts --lower-limit 0 \
	--alt-autoscale-max \
	DEF:Power=data/currentcost-w0.rrd:WATTS:AVERAGE \
	DEF:Power2=data/currentcost-w2.rrd:WATTS:AVERAGE \
	DEF:Power3=data/currentcost-w3.rrd:WATTS:AVERAGE \
	DEF:Power4=data/currentcost-w4.rrd:WATTS:AVERAGE \
	DEF:Power5=data/currentcost-w5.rrd:WATTS:AVERAGE \
	DEF:Power7=data/currentcost-w7.rrd:WATTS:AVERAGE \
	DEF:Power6=data/currentcost-w6.rrd:WATTS:AVERAGE \
	DEF:PowerA=data/wemo-A.rrd:WATTS:AVERAGE \
	DEF:PowerB=data/wemo-B.rrd:WATTS:AVERAGE \
	DEF:PowerC=data/wemo-C.rrd:WATTS:AVERAGE \
	AREA:Power2#FF000055:"IAM2 (Server)":STACK \
	AREA:Power3#00FF0055:"IAM3 (Steve's PC)":STACK \
	AREA:Power4#0000FF55:"IAM4 (Julie's PC)":STACK \
	AREA:Power5#FF00FF55:"IAM5 (Little Lounge)":STACK \
	AREA:Power7#FFFF0055:"IAM7 (Lounge)":STACK \
	AREA:Power6#00FFFF55:"IAM6 (Kitchen)":STACK \
	AREA:PowerA#77000055:"Wemo A":STACK \
	AREA:PowerB#00007755:"Wemo B":STACK \
	AREA:PowerC#00770055:"Wemo C":STACK \
	LINE1:Power#0000FF:"Total" 

	for i in 2 3 4 5 6 7 
	do

		case  $i in
		2)
			COLOR=FF0000
			;;
		3)
			COLOR=00FF00
			;;
		4)
			COLOR=0000FF
			;;
		5)
			COLOR=FF00FF
			;;
		6)
			COLOR=00FFFF
			;;
		7)
			COLOR=FFFF00
			;;
		esac

		rrdtool graph /dev/null \
		--width 10 -h 10 -z -s -$period --slope-mode \
		DEF:Power=data/currentcost-w$i.rrd:WATTS:AVERAGE \
		CDEF:PowerH=Power,3600,\/ \
		VDEF:PowerUsedH=PowerH,TOTAL \
		PRINT:PowerUsedH:"%1.1lf%s" | tail -1 > graphs/currentcost-w$i-$period.txt

		rrdtool graph graphs/currentcost-w$i-$period.svg -a SVG \
		--width 700 -h 300 -z -s -$period --slope-mode \
		--vertical-label Watts --lower-limit 0 \
		-z --no-legend \
		--alt-autoscale-max \
		DEF:Power=data/currentcost-w$i.rrd:WATTS:AVERAGE \
		DEF:PowerMax=data/currentcost-w$i.rrd:WATTS:MAX \
		VDEF:PowerAve=Power,AVERAGE \
		VDEF:PowerPeak=Power,MAXIMUM \
		CDEF:PowerRange=PowerMax \
		AREA:Power#"$COLOR"55:"Average":STACK \
		LINE1:Power#"$COLOR"55:"Average" \
		LINE2:PowerAve#"$COLOR":"Average"
	done
done



scp -r graphs steve@silver:Desktop
