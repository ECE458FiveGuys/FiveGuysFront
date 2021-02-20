import React from 'react';
import { MDBDataTable } from 'mdbreact';

const DatatablePage = () => {
    const data = {
        columns: [
            {
                label: 'Model Id',
                field: 'pk',
                sort: 'int',
                width: 150
            },
            {
                label: 'Vendor',
                field: 'vendor',
                sort: 'asc',
                width: 270
            },
            {
                label: 'Model Number',
                field: 'model_number',
                sort: 'asc',
                width: 200
            },
            {
                label: 'Description',
                field: 'description',
                sort: 'asc',
                width: 100
            },
            {
                label: 'Comment',
                field: 'comment',
                sort: 'asc',
                width: 150
            },
            {
                label: 'Calibration Frequency',
                field: 'calibration_frequency',
                sort: 'int',
                width: 100
            }
        ],
        rows: [
            {
                "pk": 257,
                "vendor": "ve",
                "model_number": "mo",
                "description": "de",
                "comment": "",
                "calibration_frequency": null
            },
            {
                "pk": 258,
                "vendor": "Fluke",
                "model_number": "52120A",
                "description": "Transconductance Amplifier",
                "comment": "supplies dc current up to 100 amps and ac current up to 120 amps, at accuracies to 140 ppm. ",
                "calibration_frequency": "5 00:00:00"
            },
            {
                "pk": 259,
                "vendor": "Fluke",
                "model_number": "7526A",
                "description": "Precision Process Calibrator",
                "comment": "Easily calibrate RTD and thermocouple readouts, pressure gauges, temperature transmitters, digital process simulators, data loggers, multimeters",
                "calibration_frequency": "58 00:00:00"
            },
            {
                "pk": 260,
                "vendor": "Fluke",
                "model_number": "6003A",
                "description": "Three Phase Electrical Power Calibrator",
                "comment": "superior accuracy and performance of three independent phases in one instrument",
                "calibration_frequency": "23 00:00:00"
            },
            {
                "pk": 261,
                "vendor": "Fluke",
                "model_number": "8558A",
                "description": "Digit Multimeter",
                "comment": "5 mega-samples-per-second high resolution digitizing",
                "calibration_frequency": "100 00:00:00"
            },
            {
                "pk": 262,
                "vendor": "Fluke",
                "model_number": "742A",
                "description": "Resistance Standards",
                "comment": "742A-10k 10 kΩ units are ideally suited for Artifact Calibration",
                "calibration_frequency": null
            },
            {
                "pk": 263,
                "vendor": "Fluke",
                "model_number": "1586A",
                "description": "Super-DAQ Precision Temperature Scanner",
                "comment": "Scans and records temperature, dc voltage, dc current, and resistance for up to 40 input channels and scan speeds as fast as 10 channels per second. ",
                "calibration_frequency": "27 00:00:00"
            },
            {
                "pk": 264,
                "vendor": "Fluke",
                "model_number": "1620A",
                "description": "Digital Thermometer-Hygrometer",
                "comment": "Measures temperature to ± 0.125 °C and humidity to ± 1.5 % on two channels, displays it on a big, clear screen. Ethernet, or RS-232 will allow you to network as many Fluke 1620s (DewKs) as desired",
                "calibration_frequency": "36 00:00:00"
            },
            {
                "pk": 265,
                "vendor": "Fluke",
                "model_number": "9600FLT",
                "description": "1 GHz Wide Offset Phase Noise Filter",
                "comment": "filter connects easily to 96xx Reference Source models in bench top or rack-mounted installations",
                "calibration_frequency": "47 00:00:00"
            },
            {
                "pk": 266,
                "vendor": "Keysight Technologies",
                "model_number": "B2981A",
                "description": "Femto / Picoammeter",
                "comment": "0.01 fA pico current resolution",
                "calibration_frequency": "3 00:00:00"
            },
            {
                "pk": 267,
                "vendor": "Keysight Technologies",
                "model_number": "PA2203A",
                "description": "IntegraVision Power Analyzer",
                "comment": "3-Phase AC ",
                "calibration_frequency": "28 00:00:00"
            },
            {
                "pk": 268,
                "vendor": "Keysight Technologies",
                "model_number": "N6731B",
                "description": "DC Power Analyzer",
                "comment": "DC power",
                "calibration_frequency": "61 00:00:00"
            },
            {
                "pk": 269,
                "vendor": "Keysight Technologies",
                "model_number": "N4960A",
                "description": "Serial BERT 32",
                "comment": "Bit error rate tester",
                "calibration_frequency": "47 00:00:00"
            },
            {
                "pk": 270,
                "vendor": "Keysight Technologies",
                "model_number": "N8976B",
                "description": "Noise Figure Analyzer",
                "comment": "high performance noise figure analyzer",
                "calibration_frequency": "24 00:00:00"
            },
            {
                "pk": 271,
                "vendor": "AMETEK",
                "model_number": "BURST NX8",
                "description": "ELECTRICAL FAST TRANSIENT GENERATOR",
                "comment": "EFT/Burst tester with a built-in coupling/decoupling network for single phase or three-phase mains supply lines and a HV terminal to connect a capacitive coupling clamp",
                "calibration_frequency": "79 00:00:00"
            },
            {
                "pk": 272,
                "vendor": "AMETEK",
                "model_number": "DITO",
                "description": "ESD Simulator",
                "comment": "simulates electrostatic discharges",
                "calibration_frequency": "49 00:00:00"
            },
            {
                "pk": 273,
                "vendor": "AMETEK",
                "model_number": "IMN2",
                "description": "Impedance Matching Network",
                "comment": "Impedance Matching Network for Surge impulse Generators ",
                "calibration_frequency": "77 00:00:00"
            },
            {
                "pk": 274,
                "vendor": "AMETEK",
                "model_number": "VCS 500N10",
                "description": "Combination Wave Simulator",
                "comment": "surge voltages up to 10kV and surge currents up to 5kVA",
                "calibration_frequency": "79 00:00:00"
            },
            {
                "pk": 275,
                "vendor": "AMETEK",
                "model_number": "AS0104",
                "description": "solid-state power amplifiers",
                "comment": "upgradeable microwave power amplifier solution",
                "calibration_frequency": "72 00:00:00"
            },
            {
                "pk": 276,
                "vendor": "Teledyne Technologies",
                "model_number": "3014z",
                "description": "WaveSurfer Oscilloscope",
                "comment": "100 MHz, 2 GS/s, 4 Ch, 10 Mpts/ch DSO with 10.1\" Wide screen Color, Capacitive Touch Screen Display",
                "calibration_frequency": "22 00:00:00"
            },
            {
                "pk": 277,
                "vendor": "Teledyne Technologies",
                "model_number": "3054z",
                "description": "WaveSurfer Oscilloscope",
                "comment": "500 MHz, 4 GS/s, 4 Ch, 10 Mpts/ch DSO with 10.1\" Wide screen Color, Capacitive Touch Screen Display",
                "calibration_frequency": "81 00:00:00"
            },
            {
                "pk": 278,
                "vendor": "Teledyne Technologies",
                "model_number": "DL05-HCM",
                "description": "Common Mode Differential Probe",
                "comment": "60 V of common mode and 80 V differential input range with 1 GHz of bandwidth",
                "calibration_frequency": "6 00:00:00"
            },
            {
                "pk": 279,
                "vendor": "Teledyne Technologies",
                "model_number": "HVP120",
                "description": "High Voltage Passive Probe",
                "comment": "probing up to 1,000 Vrms and capable of handling up to 6,000 V peak transients",
                "calibration_frequency": "63 00:00:00"
            },
            {
                "pk": 280,
                "vendor": "Teledyne Technologies",
                "model_number": "ZS4000",
                "description": "Active Voltage Probe",
                "comment": "high 1 MΩ input resistance and low 0.6 pF input capacitance ",
                "calibration_frequency": "42 00:00:00"
            },
            {
                "pk": 281,
                "vendor": "Fluke",
                "model_number": "8808A",
                "description": "Digital Multimeter",
                "comment": "The Fluke 8808A 5.5 digit multimeter has a broad range of functions, measuring volts, ohms and amps with a basic V dc accuracy of 0.015 %. It is remarkably easy to use, even by unskilled operators, because it makes the measurements you perform most often extremely easy and fast to do.",
                "calibration_frequency": "74 00:00:00"
            },
            {
                "pk": 282,
                "vendor": "Fluke",
                "model_number": "8845A/8846A",
                "description": "6.5 Digit Precision Multimeters",
                "comment": "The Fluke 8845A and 8846A 6.5 digit multimeters have the precision and versatility to handle your most demanding measurements, on the bench or in a system. These DMMs are both high performance and feature rich, yet also remarkably easy to use.",
                "calibration_frequency": "10 00:00:00"
            },
            {
                "pk": 283,
                "vendor": "Fluke",
                "model_number": "5790B",
                "description": "AC Measurement Standard",
                "comment": "The 5790B AC Measurement Standard is a multi-purpose ac measurement and transfer standard designed for the most demanding calibration applications. It combines the accuracy you would expect from a thermal transfer standard with the ease of use of a digital multimeter. Absolute ac voltage measurement uncertainties are as low as ± 24 ppm (one year, 23 °C ± 5 °C). The 5790B is designed to meet the complete ac voltage, ac current and wideband verification requirements of the Fluke Calibration 5730A, 5720A, and 5700A Multifunction Calibrators; 5522A, 5502A, 5520A, and 5500A Multi-Product Calibrators; plus other calibrators, amplifiers like the 52120, 5725A and 5205A/5215A, and transfer standards and ac voltmeters.",
                "calibration_frequency": "43 00:00:00"
            },
            {
                "pk": 284,
                "vendor": "Fluke",
                "model_number": "7750i",
                "description": "Air Data Test Set",
                "comment": "High accuracy, RVSM compliant",
                "calibration_frequency": null
            },
            {
                "pk": 285,
                "vendor": "Fluke",
                "model_number": "2100",
                "description": "Benchtop Temperature Controllers",
                "comment": "Most stable temperature controllers available",
                "calibration_frequency": "32 00:00:00"
            },
            {
                "pk": 286,
                "vendor": "Fluke",
                "model_number": "732C",
                "description": "DC Voltage Reference Standards",
                "comment": "The Fluke Calibration 732C DC Voltage Reference Standard is a RoHS compliant direct voltage reference used to maintain the volt in primary and secondary standards laboratories. Individual 732C voltage standards provide 10 V, 1 V, and 0.1 V outputs and may be transported easily to remote locations while the dc reference is maintained in the laboratory. The 734C DC Voltage Reference Standard consists of four electrically and mechanically independent 732C DC Reference Standards and a rack-width enclosure. Two model families, Base and Select, differ in that the Select models are two times more stable than the Base models.",
                "calibration_frequency": "50 00:00:00"
            },
            {
                "pk": 287,
                "vendor": "Fluke",
                "model_number": "9103",
                "description": "Dry-Well Calibrators & Dry Block Calibrators",
                "comment": "If you've been using a dry well calibrator or dry block calibrator for field work, you know there's a lot more to them than temperature range and stability. Size, weight, speed, convenience, and software are also significant.",
                "calibration_frequency": "38 00:00:00"
            },
            {
                "pk": 288,
                "vendor": "Fluke",
                "model_number": "E-DWT-H",
                "description": "Electronic Deadweight Tester",
                "comment": "E-DWT-H breaks new ground in dead weight tester calibration, improving the hydraulic pressure calibration process. E-DWT-H is an electronic calibrator designed to replace mechanical, piston-cylinder and weight based deadweight testers. It's a lighter, easier-to-use deadweight tester calibration alternative that is at home in the lab or instrument shop, as well as in the field performing in-situ calibrations and tests. This complete hydraulic pressure calibration system combines the convenience and precision of continuous, realtime electronic pressure measurement with the simple and direct operation of high quality operator controlled pressure generation hardware. E-DWT-H one year measurement uncertainty is ± 0.02 % of reading with ranges up to 30,000 psi. It can be configured to provide this uncertainty from its full scale down to 1 % of its range. Built-in pressure generation and control hardware allow the operator to fill and prime the system under test and generate and precisely adjust pressure throughout the range with ease.",
                "calibration_frequency": "30 00:00:00"
            },
            {
                "pk": 289,
                "vendor": "Fluke",
                "model_number": "5322A",
                "description": "Electrical Safety Tester Calibrator",
                "comment": "The 5322A Electrical Tester Calibrator helps calibration technicians comply with new regulatory standards up to four times faster than with traditional manual, multiple-product methods.The 5322A replaces the 5320A Electrical Tester Calibrator.",
                "calibration_frequency": "9 00:00:00"
            },
            {
                "pk": 290,
                "vendor": "Fluke",
                "model_number": "6531",
                "description": " E-DWT Electronic Deadweight Tester Kits",
                "comment": "Fluke Calibration improved the hydraulic pressure calibration process with the introduction of E-DWT-H electronic deadweight tester. E-DWT-H is an electronic calibrator designed to deliver traditional hydraulic deadweight tester performance with digital measurement features and convenience. Some improvements offered by E-DWT-H include:",
                "calibration_frequency": null
            },
            {
                "pk": 291,
                "vendor": "Fluke",
                "model_number": "ITS-90",
                "description": "Fixed-Point Cells",
                "comment": "Fluke Calibration scientists have designed and tested ITS-90 fixed-point cells for many years. Not only do we manufacture all the major fixed points, our metrologists have written extensively on the theory and use of cells and have created new designs covering a range of applications no other company can match. Our testing of fixed-point cells is also unmatched. The scope of our accreditation includes the testing of ITS-90 fixed-point cells. Each cell may be purchased with this intercomparison option, which includes comparing the equilibrium value of your cell against that of a reference cell.",
                "calibration_frequency": "16 00:00:00"
            },
            {
                "pk": 292,
                "vendor": "Fluke",
                "model_number": "910",
                "description": "GPS Frequency Standards",
                "comment": "The 910 and 910R GPS frequency references are fully traceable and extremely accurate gps frequency standards and are ideally suited for use in many applications, including telecommunications, calibration and automatic test systems.",
                "calibration_frequency": "79 00:00:00"
            },
            {
                "pk": 293,
                "vendor": "Fluke",
                "model_number": "910R",
                "description": "GPS Frequency Standards",
                "comment": "The 910 and 910R GPS frequency references are fully traceable and extremely accurate gps frequency standards and are ideally suited for use in many applications, including telecommunications, calibration and automatic test systems.",
                "calibration_frequency": "42 00:00:00"
            },
            {
                "pk": 294,
                "vendor": "Fluke",
                "model_number": "700HPPK",
                "description": "Pneumatic Test Pump Kit",
                "comment": "The Fluke Calibration 700HPPK Pneumatic Test Pump Kit generates and adjusts pneumatic pressures up to 21 MPa (3000 psi), without requiring a nitrogen bottle or other external pressure supply. It supplies pressure to devices under test (DUTs) that include transmitters, controllers, pilots, digital and analog gauges, and more. It's the perfect solution for generating high pressure in the field, where conditions and operating surfaces can vary.",
                "calibration_frequency": "11 00:00:00"
            },
            {
                "pk": 295,
                "vendor": "Fluke",
                "model_number": "8270A",
                "description": "and 8370A Modular High-Pressure Controllers / Calibrators",
                "comment": "The 8270A measures and controls pressures from vacuum to 44 MPa (6400 psi). It can be configured with ranges as low as 100 kPa (15 psi).",
                "calibration_frequency": "75 00:00:00"
            },
            {
                "pk": 296,
                "vendor": "Fluke",
                "model_number": "6020",
                "description": "High Temperature Calibration Oil Baths",
                "comment": "Find a high temperature oil bath (300 °C) with high capacity and deep immersion from Fluke Calibration. Our metrology baths are well known world-wide for excellent temperature control that maintains excellent temperature stability (±0.003 °C) and uniformity (±0.004 °C). Models 6020, 6022, and 6024 can be used with water at lower temperature for even better performance.",
                "calibration_frequency": "94 00:00:00"
            },
            {
                "pk": 297,
                "vendor": "Fluke",
                "model_number": "5128A",
                "description": "RHapid-Cal® Humidity Generator",
                "comment": "In the lab, the 5128A calibrates humidity probes 33% faster than a two-pressure generator.",
                "calibration_frequency": "3 00:00:00"
            },
            {
                "pk": 298,
                "vendor": "Fluke",
                "model_number": "P3100",
                "description": "Hydraulic Deadweight Testers",
                "comment": "The P3100 Models are available in single or dual piston formats for increased operating ranges. Units can be supplied in psi, bar, kgf/cm², and MPa. These robust instruments are highly accurate, quick and easy to use. Units feature a built-in priming pump for large volume applications, piston flotation indicators and a high quality screw press for fine pressure control.",
                "calibration_frequency": "92 00:00:00"
            },
            {
                "pk": 299,
                "vendor": "Fluke",
                "model_number": "P5514-2700G",
                "description": "Hydraulic Pressure Calibrators",
                "comment": "Fluke Calibration hydraulic calibrators are an easy-to-use alternative to traditional deadweight testers. These pressure calibrators are conveniently bundled with up to six 2700G Reference Pressure Gauges for a complete, benchtop pressure calibration solution to provide the accuracy, reliability, and capability you need to calibrate dial gauges, digital test gauges and pressure transmitters.",
                "calibration_frequency": "52 00:00:00"
            },
            {
                "pk": 300,
                "vendor": "Fluke",
                "model_number": "7615",
                "description": "Hydraulic Pressure Controller",
                "comment": "The Series 7615 Hydraulic Pressure Controller provides a unique, high speed approach to high pressure calibration and testing. Utilizing patented control technology, the 7615 can control to the set-point in five seconds or less for a pressure step up to 4 000 psi. A variety of pressure ranges are available to 40 000 psi (2 750 bar). The unit is compatible with virtually any non-corrosive pressure media including water, synthetic oils, Fluorinert, mineral oil, and others. The 7615 is also available with the Triple Scale / Dual Sensor option which can provide up to six ranges in one instrument. ",
                "calibration_frequency": "43 00:00:00"
            },
            {
                "pk": 301,
                "vendor": "Fluke",
                "model_number": "5901",
                "description": "Triple Point of Water Cells",
                "comment": "The triple point of water (TPW) is not only the most accurate and fundamental temperature standard available, it's also one of the least expensive and simplest to use.",
                "calibration_frequency": "3 00:00:00"
            },
            {
                "pk": 302,
                "vendor": "Fluke",
                "model_number": "720A",
                "description": "Kelvin-Varley Divider",
                "comment": "Model 720A Kelvin-Varley Divider is a high-resolution primary ratio standard with absolute linearity of 0.1 ppm, temperature coefficient of linearity of 0.1 ppm/ºC, and self-calibration capability. ",
                "calibration_frequency": "39 00:00:00"
            },
            {
                "pk": 303,
                "vendor": "Fluke",
                "model_number": "6102",
                "description": "Micro-Bath Thermometer Calibrators",
                "comment": "Need portability and extreme stability? Fluke 6102, Fluke 7102, and Fluke 7103 Micro-Baths have both. We invented the Micro-Bath. And, while many have tried to duplicate it, none of them use proprietary Fluke Calibration controllers, so none of them deliver performance like a Fluke Calibration bath. Micro-Baths can be used anywhere for any type of sensor. The 6102 weighs less than 4.5 kg (10 lb.), with the fluid. It's lighter and smaller than most dry-wells, has a spill-proof lid, and is easier to carry than your lunch. You can take it where you need to go without carts or excessive effort. Micro-Baths can even be transported with the fluid in them.",
                "calibration_frequency": "22 00:00:00"
            },
            {
                "pk": 304,
                "vendor": "Fluke",
                "model_number": "5522A",
                "description": "Multi-Product Calibrator",
                "comment": "The 5522A Multi-Product Calibrator replaces the 5520A and addresses a wide calibration workload and comes with internal and external protection features that protect it against damage and make it easier to transport for on-site or mobile calibration. The 5522A can also be fully automated with MET/CAL®",
                "calibration_frequency": "78 00:00:00"
            },
            {
                "pk": 305,
                "vendor": "Fluke",
                "model_number": "8508A",
                "description": "8.5 Digit Reference Multimeter",
                "comment": "The 8508A is an 8.5-digit resolution instrument designed specifically for metrologists. With superior accuracy and stability over a wide range of measurements, the 8508A is designed to serve as a versatile precision measurement tool for calibration laboratories that must meet increasingly stringent measurement uncertainty analysis requirements demanded by ISO 17025, as well as the need for increased productivity.",
                "calibration_frequency": "88 00:00:00"
            },
            {
                "pk": 306,
                "vendor": "Fluke",
                "model_number": "9500B",
                "description": "Oscilloscope Calibrator",
                "comment": "Oscilloscope calibration can be complex, time consuming and expensive. A significant amount of skilled operator interaction and interpretation is often required to complete the job, and today's multi-channel instruments frequently mean that a great deal of lead switching is required. Even automated systems require significant manual intervention to complete elements of the most simple calibration procedures. Worse still, switching systems or multiplexers used to enable a degree of automation often contribute more errors and aberrations than the instrument being calibrated. ",
                "calibration_frequency": "88 00:00:00"
            },
            {
                "pk": 307,
                "vendor": "Fluke",
                "model_number": "3130",
                "description": "Portable Pressure Calibrator",
                "comment": "The Fluke 3130 Portable Pneumatic Pressure Calibrator is ideal for calibrating pressure transmitters, transducers, gauges and similar devices. The Fluke 3130 contains everything you need to generate, control and measure pressure, as well as read the output of the device under test (DUT).",
                "calibration_frequency": "36 00:00:00"
            },
            {
                "pk": 308,
                "vendor": "Fluke",
                "model_number": "PGC-10000-AF",
                "description": "Pneumatic Gauge Calibrator",
                "comment": "This pneumatic pressure gauge calibrator optimizes the testing and calibration of analog and digital pressure gauges and indicators in ranges from 500 to 10,000 psi (3.5 to 70 MPa) using gas as the operating medium. ",
                "calibration_frequency": "38 00:00:00"
            },
            {
                "pk": 309,
                "vendor": "Fluke",
                "model_number": "6105A",
                "description": " Electrical Power Quality Calibrator",
                "comment": "In 2002, Fluke Calibration launched the 6100A Electrical Power Calibration Standard.",
                "calibration_frequency": "94 00:00:00"
            },
            {
                "pk": 310,
                "vendor": "Fluke",
                "model_number": "8588A",
                "description": "Reference Multimeter",
                "comment": "The 8588A Reference Multimeter is the world's most stable digitizing multimeter. Designed for calibration laboratories, this long-scale high-precision reference features superior accuracy and long-term stability over a wide measurement range, with an intuitive user interface and a color display.",
                "calibration_frequency": "31 00:00:00"
            },
            {
                "pk": 311,
                "vendor": "Fluke",
                "model_number": "4180",
                "description": "Precision Infrared Calibrators",
                "comment": "Now it's easy to increase your IR temperature measurement accuracy with the new 4180, 4181 Precision Infrared Calibrators from Fluke Calibration. These infrared temperature calibrators give more consistent, accurate and reliable calibrations because emissivity is radiometrically calibrated, and the target size minimizes size of source effect errors. In addition, these infrared calibrators simplify calibration because they uniquely compensate for errors caused by thermometer emissivity settings.",
                "calibration_frequency": "86 00:00:00"
            },
            {
                "pk": 312,
                "vendor": "Fluke",
                "model_number": "2271A",
                "description": "Industrial Pressure Calibrator",
                "comment": "The Fluke Calibration 2271A Industrial Pressure Calibrator provides a complete, automated pressure testing solution for calibrating a wide variety of pressure gauges and sensors. Thanks to its modular design, it can be configured to meet different needs and budgets, and expanded to cover a broad workload.",
                "calibration_frequency": "39 00:00:00"
            },
            {
                "pk": 313,
                "vendor": "Fluke",
                "model_number": "752A",
                "description": "Reference Divider",
                "comment": "The 752A reference dividers are precision 10:1 and 100:1 dividers designed primarily for comparing direct voltage levels of various sources to a 10V voltage reference standard like a 732B. ",
                "calibration_frequency": null
            },
            {
                "pk": 314,
                "vendor": "Fluke",
                "model_number": "2700G",
                "description": "Series Reference Pressure Gauges",
                "comment": "The 2700G Reference Pressure Gauges provide best-in-class measurement performance in a rugged, easy-to-use, economical package. Improved measurement accuracy allows it to be used for a wide variety of applications. It is ideal for calibrating pressure measurement devices such as pressure gauges, transmitters, transducers, and switches. In addition, it can be used as a check standard or to provide process measurements with data logging.",
                "calibration_frequency": "79 00:00:00"
            },
            {
                "pk": 315,
                "vendor": "Fluke",
                "model_number": "1523",
                "description": "Reference Thermometers",
                "comment": "The Fluke 1523 and Fluke 1524 Reference Thermometers from Fluke Calibration measure, graph, and record PRTs, thermocouples, and thermistors. These thermometer readouts deliver exceptional accuracy, wide measurement range, temperature logging, and trending, all in a handheld tool you can take anywhere.",
                "calibration_frequency": "86 00:00:00"
            },
            {
                "pk": 316,
                "vendor": "Fluke",
                "model_number": "7009",
                "description": "Resistor Baths",
                "comment": "Regardless of the size and number of standard resistors you have to maintain, Fluke Calibration has a bath that will do the job for you. Choose one of the three models described here or call us for information on other sizes.",
                "calibration_frequency": "68 00:00:00"
            },
            {
                "pk": 317,
                "vendor": "Fluke",
                "model_number": "1594A",
                "description": "Super-Thermometers",
                "comment": "The Fluke Calibration 1594A and 1595A Super-Thermometers combine the accuracy of complex and expensive bridges with innovative features that simplify measurement processes and provide excellent value. They are accurate enough for the primary lab and economical enough for the secondary lab. With temperature-controlled internal reference resistors, six input channels, a large graphical display, and a multitude of temperature-specific measurement functions, PRT, thermistor and SPRT calibration has never been so easy and economical. And with the built-in Ratio Self-Calibration function, you can verify or calibrate the Super-Thermometer's ratio accuracy in-house with the press of a button”no other single thermometry bridge can do so much, so well!",
                "calibration_frequency": "88 00:00:00"
            },
            {
                "pk": 318,
                "vendor": "Fluke",
                "model_number": "3125",
                "description": "Surface Probe Calibrator",
                "comment": "Calibrates surface sensors up to 400°C",
                "calibration_frequency": "30 00:00:00"
            },
            {
                "pk": 319,
                "vendor": "Fluke",
                "model_number": "525B",
                "description": "Temperature/Pressure Calibrator",
                "comment": "The 525B Temperature/Pressure Calibrator gives you a workhorse combination of high accuracy and broad functionality for temperature and pressure instrument calibration. Compact and economical, the 525B has an interface for automated calibration, providing wide workload coverage in instrument shops and calibration labs, as well as in ATE applications.",
                "calibration_frequency": "36 00:00:00"
            },
            {
                "pk": 320,
                "vendor": "Fluke",
                "model_number": "9118A",
                "description": "Thermocouple Calibration Furnace",
                "comment": "The Fluke Calibration 9118A Thermocouple Calibration Furnace is a horizontal, open-ended tube furnace with a temperature range of 300 °C to 1200 °C. It is used for comparison calibration of noble and base-metal thermocouples by secondary high-temperature labs and instrument shops in industries such as aerospace, automotive, energy, metals, and plastics. The 9118A is the most accurate, reliable, and flexible furnace in its class, meeting the demanding requirements of high-temperature thermocouple calibration.  ",
                "calibration_frequency": "86 00:00:00"
            },
            {
                "pk": 321,
                "vendor": "v",
                "model_number": "m",
                "description": "d",
                "comment": "c",
                "calibration_frequency": null
            },
            {
                "pk": 322,
                "vendor": "vendor",
                "model_number": "model_number",
                "description": "desc",
                "comment": null,
                "calibration_frequency": null
            }
        ]
    };

    return (
        <MDBDataTable
            autoWidth={false}
            //fixed={true}
            striped
            bordered
            small
            data={data}
        />
    );
}

export default DatatablePage;